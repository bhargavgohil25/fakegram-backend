import { Hashtags } from 'src/hashtags/hashtags.entity';
import { Likes } from '../likes/likes.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
} from 'typeorm';
import { FakeBaseEntity } from '../commons/base.entity';
import { User } from '../users/users.entity';
import { Point } from 'geojson';
import { Comments } from '../comments/comments.entity';
import { PrivateFile } from '../files/private-file.entity';

class Mention {
  id: string;
  userName: string;
}

@Entity('posts')
export class Posts extends FakeBaseEntity {
  @Column({ length: 200, nullable: true })
  caption: string;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.post, { cascade: true })
  images: PrivateFile[];

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

  @OneToMany(() => Likes, (like) => like.post)
  likes: Likes[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  // @Column('json', { default: [] })
  // mentions ?: Array<Mention>;

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comments[];

  @Column({ type: 'double precision', name: 'd_lat', nullable: true })
  lat: number;

  @Column({ type: 'double precision', name: 'd_long', nullable: true })
  long: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  // TODO : comments database section
}
