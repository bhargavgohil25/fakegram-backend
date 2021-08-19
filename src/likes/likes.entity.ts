import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { FakeBaseEntity } from '../commons/base.entity';
// Entities
import { User } from '../users/users.entity';
import { Posts } from '../posts/posts.entity';

@Unique('like_pair', ['user', 'post'])
@Entity('likes')
export class Likes extends FakeBaseEntity {
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Posts, (post) => post.likes)
  @JoinColumn({ name: 'post_id' })
  post: Posts;
}
