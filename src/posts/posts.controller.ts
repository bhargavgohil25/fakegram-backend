import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { User } from '../users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReturnPostData } from './dto/post.dto';
import { Posts } from './posts.entity';
import { LikeDto } from './dto/like.dto';
import { LikesService } from '../likes/likes.service';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

@Controller('posts')
@UseGuards(JwtAuthGuard)
@Serialize(ReturnPostData)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private likesService: LikesService,
  ) {}

  @Get('/current')
  async getCurrentUserId(@CurrentUser() user: User) {
    // console.log('running endpoint');
    // console.log(user)
    return user;
  }

  @Post('/')
  @UseInterceptors(FilesInterceptor('files', 3))
  async createNewPost(
    @CurrentUser() user: User,
    @Body() postBodyDto: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Posts> {

    if(!files || files.length === 0) {
      throw new BadRequestException('Cannot upload only Text');
    }

    const validFiles : Array<Express.Multer.File> = [];
    for (const file of files) {
      if (
        file.originalname.endsWith('.jpg') ||
        file.originalname.endsWith('.jpeg') ||
        file.originalname.endsWith('.png')
      ) {
        validFiles.push(file);
      }
    }
    return this.postsService.createPost(user, postBodyDto, validFiles);
  }

  @Get('/files/:id')
  async getPrivateFile(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const file = await this.postsService.getPrivateFile(user.id, id);
    return file.stream.pipe(res);
  }

  @Get('/:userid')
  async getPostsByUserId(
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ): Promise<Posts[]> {
    return this.postsService.getPostsByUserId(userid, user.id);
  }

  // TODO : delete post
  @Delete('/:postid')
  async deletePost(@Param('postid') postid: string): Promise<void> {
    // return this.postsService.deletePost(postid);
  }

  @Post('/like')
  async likePost(
    @Body() likeDto: LikeDto,
    @CurrentUser() user: User,
  ){
    const post = await this.postsService.getPostsById(likeDto.postId);

    if (!post) {
      throw new NotFoundException('Post was not foound');
    }
    const response = this.likesService.likeUnlike(post, user);

    return {
      message: response,
    }
  }
}
