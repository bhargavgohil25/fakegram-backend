import { FakeBaseEntity } from '../commons/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Posts } from '../posts/posts.entity';
import { Comments } from './comments.entity';

@Entity()
export class Replies extends FakeBaseEntity {
  @Column()
  reply: string;

  @ManyToOne(() => Comments, (comment) => comment.replies, { onDelete : 'CASCADE' })
  parentComment: Comments;

  @ManyToOne(() => User)
  user: User;

  // For likes on reply
  // @ManyToMany(() )
}
