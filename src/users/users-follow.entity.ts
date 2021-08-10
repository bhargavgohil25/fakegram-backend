import { Entity, JoinColumn, Unique, ManyToOne } from "typeorm";
import { FakeBaseEntity } from "../commons/base.entity";
import { User } from "./users.entity";

@Unique('follow_pair', ['follower', 'followee'])
@Entity('user_followings')
export class UserFollowing extends FakeBaseEntity {
  @JoinColumn({ name : 'follower_id' })
  @ManyToOne(() => User)
  follower : User;

  @JoinColumn({ name : 'followee_id' })
  @ManyToOne(() => User)
  followee : User;
}

