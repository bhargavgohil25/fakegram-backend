import { BeforeInsert, Entity, Column, OneToMany } from 'typeorm';
import { FakeBaseEntity } from '../commons/base.entity';

import * as bcrypt from 'bcryptjs';
import { UserFollowing } from './users-follow.entity';

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

  @Column({ nullable: true, length: 50 })
  avatar?: string;

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  // withoutPassword() {
  //   return Object.fromEntries(
  //     Object.entries(this).filter(([key, val]) => key !== 'password')
  //   );
  // }

  // async validatePassword(password: string): Promise<boolean> {
  //   return bcrypt.compare(password, this.password);
  // }
}
