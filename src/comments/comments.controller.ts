import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { User } from '../users/users.entity';
import { Comments } from './comments.entity';
import { CommentsService } from './comments.service';
import { CommentsBodyDto } from './dto/comments-body.dto';
import { CommentsReturnDto } from './dto/comments-return.dto';
import { GetCommentsReturnDto } from './dto/get-comments.dto';
import { Replies } from './replies.entity';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Serialize(CommentsReturnDto)
  @Post('/:postid')
  async postComment(
    @Param('postid') postid: string,
    @Body() commentBody: CommentsBodyDto,
    @CurrentUser() user: User,
  ) : Promise<Comments | Replies> {
    return await this.commentsService.createComment(postid, commentBody, user);
  }

  @Serialize(GetCommentsReturnDto)
  @Get('/:postid/all-comments')
  async getComments(@Param('postid') postid: string) : Promise<Comments[]> {
    return await this.commentsService.getCommentsByPostId(postid);
  }
}
