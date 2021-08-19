import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { LikeDto } from '../posts/dto/like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './likes.entity';
import { Repository } from 'typeorm';
import { Posts } from '../posts/posts.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private likesRepo: Repository<Likes>,
  ) {}

  /**
   * @description like or unlike a post
   * @param Posts and User Entity
   * @returns string (Liked or Unliked Status)
   */
  async likeUnlike(post: Posts, user: User) {
    const userId = user.id;
    const postId = post.id;

    const foundLike = await this.likesRepo.findOne({
      where: {
        user,
        post,
      },
    });

    if (!foundLike) {
      const like = await this.likesRepo.save({ user, post });

      return 'liked a post';
    } else {
      await this.likesRepo
        .createQueryBuilder()
        .delete()
        .where('user = :userId', { userId })
        .andWhere('post = :postId', { postId })
        .execute();

      return 'Unliked the post';
    }
  }
}
