import { Entity, JoinColumn, Unique, ManyToOne } from "typeorm";
import { FakeBaseEntity } from "../commons/base.entity";
import { User } from "./users.entity";

@Unique('follow_pair', ['follower', 'followee'])
@Entity('user_followings')
export class UserFollowing extends FakeBaseEntity {
  @ManyToOne(() => User, user => user.followees)
  @JoinColumn({ name : 'follower_id' })
  follower : User;

  @ManyToOne(() => User, user => user.followers)
  @JoinColumn({ name : 'followee_id' })
  followee : User;
}

