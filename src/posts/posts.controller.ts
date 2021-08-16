import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { User } from '../users/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReturnPostData } from './dto/post.dto';

@Controller('posts')
@Serialize(ReturnPostData)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserId(@CurrentUser() user: User) {
    // console.log('running endpoint');
    // console.log(user)
    return user;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createNewPost(@CurrentUser() user : User, @Body() postBodyDto : CreatePostDto) {
    return this.postsService.createPost(user, postBodyDto)
  }

  @Get("/:userid")
  async getPostsByUserId(@Param("userid") userid : string) {
    return this.postsService.getPostsByUserId(userid);
  }
}
