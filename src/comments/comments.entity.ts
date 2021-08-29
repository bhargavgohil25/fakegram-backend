import { FakeBaseEntity } from '../commons/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Posts } from '../posts/posts.entity';

@Entity()
@Tree('closure-table')
export class Comments extends FakeBaseEntity {
  @Column({ nullable: false })
  commentBody: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @TreeChildren()
  children: Comments[];

  @TreeParent()
  parent: Comments;

}
