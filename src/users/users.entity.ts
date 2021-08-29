import {
  BeforeInsert,
  Entity,
  Column,
  OneToMany,
  AfterLoad,
  AfterUpdate,
  BeforeUpdate,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { FakeBaseEntity } from '../commons/base.entity';

import * as bcrypt from 'bcryptjs';
import { UserFollowing } from './users-follow.entity';
import { Posts } from '../posts/posts.entity';
import { Likes } from '../likes/likes.entity';
import { Comments } from '../comments/comments.entity';
import { PublicFile } from '../files/public-file.entity';

@Entity('users')
export class User extends FakeBaseEntity {
  @Column({ nullable: false, length: 50, unique: true })
  userName: string;

  @Column({ nullable: false, length: 50, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, length: 50 })
  bio?: string;

  @JoinColumn()
  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  avatar ?: PublicFile;
  
  @Column({ name: 'follower_count', default: 0 })
  followerCount: number;

  @Column({ name: 'followee_count', default: 0 })
  followeeCount: number;

  @Column('boolean', { default: false })
  verified: boolean;

  @OneToMany(() => UserFollowing, (userFollowing) => userFollowing.followee)
  followers: User[];

  @OneToMany(() => UserFollowing, (userFollowing) => userFollowing.follower)
  followees: User[];

  @OneToMany(() => Posts, (post) => post.author)
  posts: Posts[];

  @OneToMany(() => Likes, (like) => like.user)
  likes: Likes[];

  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
  // @AfterLoad()
  // getFollowerCount() {
  //   this.followerCount = this.followers.length;
  // }

  // @AfterLoad()
  // getFolloweeCount() {
  //   this.followeeCount = this.followees.length;
  // }
  // withoutPassword() {
  //   return Object.fromEntries(
  //     Object.entries(this).filter(([key, val]) => key !== 'password')
  //   );
  // }

  // async validatePassword(password: string): Promise<boolean> {
  //   return bcrypt.compare(password, this.password);
  // }
}
