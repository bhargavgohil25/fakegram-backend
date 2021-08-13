import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FakeBaseEntity } from '../commons/base.entity';
import { User } from '../users/users.entity';

class Mention {
  id: string;
  userName: string;
}

@Entity('posts')
export class Post extends FakeBaseEntity {
  @Column({ length: 200, nullable: true })
  caption: string;

  @Column('json', { default: [] })
  images: Array<string>;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'repost_count', default: 0 })
  repostCount: number;

  @Column('json', { default: [] })
  hashTags: Array<string>;

  @Column('json', { default: [] })
  mentions: Array<Mention>;

  @Column()
  comments : string;
}
