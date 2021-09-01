import {
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
import { Express } from 'express';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

@Controller('posts')
@Serialize(ReturnPostData)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private likesService: LikesService,
  ) {}

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserId(@CurrentUser() user: User) {
    // console.log('running endpoint');
    // console.log(user)
    return user;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  async createNewPost(
    @CurrentUser() user: User,
    @Body() postBodyDto: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Posts> {
    return this.postsService.createPost(user, postBodyDto, files);
  }

  @Get('/files/:id')
  @UseGuards(JwtAuthGuard)
  async getPrivateFile(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const file = await this.postsService.getPrivateFile(user.id, id);
    return file.stream.pipe(res);
  }

  @Get('/:userid')
  @UseGuards(JwtAuthGuard)
  async getPostsByUserId(
    @Param('userid') userid: string,
    @CurrentUser() user: User,
  ): Promise<Posts[]> {
    return this.postsService.getPostsByUserId(userid, user.id);
  }

  // TODO : delete post
  @Delete('/:postid')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('postid') postid: string): Promise<void> {
    // return this.postsService.deletePost(postid);
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Body() likeDto: LikeDto,
    @CurrentUser() user: User,
  ): Promise<string> {
    const post = await this.postsService.getPostsById(likeDto.postId);

    if (!post) {
      throw new NotFoundException('Post was not foound');
    }
    return this.likesService.likeUnlike(post, user);
  }
}
