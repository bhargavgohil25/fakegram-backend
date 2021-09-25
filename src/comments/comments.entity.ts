import { FakeBaseEntity } from '../commons/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Posts } from '../posts/posts.entity';
import { Replies } from './replies.entity';

@Entity()
export class Comments extends FakeBaseEntity {
  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @OneToMany(() => Replies, (reply) => reply.parentComment, { cascade : true })
  replies : Replies;
}
