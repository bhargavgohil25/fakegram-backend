import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { User } from '../users/users.entity';
import { CommentsService } from './comments.service';
import { CommentsBodyDto } from './dto/comments-body.dto';
import { CommentsReturnDto } from './dto/comments-return.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  
  @Serialize(CommentsReturnDto)
  @Post('/:postid')
  async postComment(
    @Param('postid') postid: string,
    @Body() commentBody: CommentsBodyDto,
    @CurrentUser() user: User,
  ) {
    return await this.commentsService.createComment(postid, commentBody, user);
  }

  @Get('/')
  async getComments() {
    return await this.commentsService.getComments();
  }
}
