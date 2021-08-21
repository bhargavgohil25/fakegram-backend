import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
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
  async createNewPost(
    @CurrentUser() user: User,
    @Body() postBodyDto: CreatePostDto,
  ): Promise<Posts> {
    return this.postsService.createPost(user, postBodyDto);
  }

  @Get('/:userid')
  @UseGuards(JwtAuthGuard)
  async getPostsByUserId(@Param('userid') userid: string, @CurrentUser() user : User): Promise<Posts[]> {
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
    
    if(!post){
      throw new NotFoundException('Post was not foound')
    }
    return this.likesService.likeUnlike(post, user);
  }

}
