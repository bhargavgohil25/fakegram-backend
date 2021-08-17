import { Hashtags } from 'src/hashtags/hashtags.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { FakeBaseEntity } from '../commons/base.entity';
import { User } from '../users/users.entity';

class Mention {
  id: string;
  userName: string;
}

@Entity('posts')
export class Posts extends FakeBaseEntity {
  @Column({ length: 200, nullable: true })
  caption: string;

  @Column('text', { array: true, default: [] })
  images: Array<string>;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'repost_count', default: 0 })
  repostCount: number;

  @ManyToMany(() => Hashtags, (hashtags) => hashtags.posts, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'posts_hashtags_relation',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'hashtag_id',
      referencedColumnName: 'id',
    },
  })
  hashtags: Array<Hashtags>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column('json', { default: [] })
  mentions: Array<Mention>;

  // TODO : comments database section
}
