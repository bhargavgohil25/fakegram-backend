import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { TreeRepository } from 'typeorm';
import { User } from '../users/users.entity';
import { Comments } from './comments.entity';
import { CommentsBodyDto } from './dto/comments-body.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepo: TreeRepository<Comments>,
    private postsService: PostsService,
  ) {}

  async createComment(postid: string, body: CommentsBodyDto, user: User) {
    const { parentCommentId } = body;
    console.log(parentCommentId);
    let parentComment: Comments;
    if (parentCommentId) {
      parentComment = await this.commentsRepo.findOne({ id: parentCommentId });
    }

    const comment = await this.commentsRepo.create();
    const post = await this.postsService.getPostsById(postid);

    if (!post) {
      throw new BadRequestException('Post was not found');
    }

    comment.commentBody = body.commentBody;
    comment.user = user;
    comment.post = post;


    if (parentComment) {
      comment.parent = parentComment;
    }

    const resComment = await this.commentsRepo.save(comment);

    return resComment;
  }

  async getComments() {
    // const comments = await this.commentsRepo.findTrees();
    const comments = await this.commentsRepo.findTrees();
    return comments;
  }
}
