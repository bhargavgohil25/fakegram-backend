import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { LikeDto } from '../posts/dto/like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './likes.entity';
import { Repository } from 'typeorm';
import { Posts } from '../posts/posts.entity';
import { NotificationsQueueProducer } from '../notifications/notifications.producer';


interface NotificationObject {
  triggeredBy: string,
  triggeredOn: string,
  notificationMessage: string,
  postId: string,
}

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private likesRepo: Repository<Likes>,
    private notificationService: NotificationsQueueProducer,
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
    
    let status: string;

    if (!foundLike) {
      const like = await this.likesRepo.save({ user, post });

      // send notification to the queue
      const notifyObj : NotificationObject = {
        triggeredBy: userId,
        triggeredOn: userId,
        notificationMessage: `${user.userName} liked your post ${post.caption}`,
        postId: post.id,
      }

      this.notificationService.addNotificationToQueue(notifyObj);

      status = 'Liked';
    } else {
      await this.likesRepo
        .createQueryBuilder()
        .delete()
        .where('user = :userId', { userId })
        .andWhere('post = :postId', { postId })
        .execute();

      status = 'Unliked';
    }

    return status;
  }
}
