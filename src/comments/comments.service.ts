import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Comments } from './comments.entity';
import { CommentsBodyDto } from './dto/comments-body.dto';
import { Replies } from './replies.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepo: Repository<Comments>,
    private postsService: PostsService,
    @InjectRepository(Replies)
    private replyRepo: Repository<Replies>,
  ) {}

  /**
   * @description Creates a comment/reply based on the parentCommentId from the body 
   * @param postid 
   * @param commentBody 
   * @param user 
   * @returns `Comment` or `Reply`
   */
  async createComment(
    postid: string,
    commentBody: CommentsBodyDto,
    user: User,
  ) {
    const { parentCommentId, text } = commentBody;
    const post = await this.postsService.getPostsById(postid);

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    let newComment: Comments | Replies;
    if (parentCommentId) {
      // Means its a reply
      const parentComment = await this.commentsRepo.findOne({
        id: parentCommentId,
      });

      if (!parentComment) {
        throw new BadRequestException('Parent Comment Not Found');
      }

      newComment = await this.replyRepo.create();

      newComment.reply = text;
      newComment.user = user;
      newComment.parentComment = parentComment;
    } else {
      // its a head comment
      newComment = await this.commentsRepo.create();

      newComment.comment = text;
      newComment.post = post;
      newComment.user = user;
    }

    return parentCommentId
      ? await this.replyRepo.save(newComment)
      : await this.commentsRepo.save(newComment);
  }

  /**
   * @description gets all the comments of the post
   * @param postid 
   * @returns `Array<Comments | Replies>`
   */
  async getCommentsByPostId(postid: string) {
    const post = await this.postsService.getPostsById(postid);

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }

    const res = await this.commentsRepo
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('comments.replies', 'replies')
      .leftJoin('replies.user', 'replyUser')
      .addSelect('replyUser.userName')
      .where('comments.post_id = :postid', { postid })
      .orderBy('comments.created_at', 'ASC')
      .getMany();

    return res;

  }
}
