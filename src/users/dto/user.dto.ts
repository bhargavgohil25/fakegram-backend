import { Expose, Type, Transform } from "class-transformer";
import { User } from "../users.entity";

class follower {
  @Expose()
  id : string;

  @Expose()
  userName : string;

  @Expose()
  email : string;

  @Expose()
  bio : string;

  @Expose()
  avatar : string;

  @Expose()
  followerCount : number;

  @Expose()
  followeeCount : number;
}

class mock {

  @Expose()
  @Type(() => follower)
  follower : Partial<User>;

  @Expose()
  @Type(() => follower)
  followee : Partial<User>;
}

export class UserDto {
  @Expose()
  id : string;
  
  @Expose()
  userName : string;
  
  @Expose()
  email : string;

  @Expose()
  bio : string;

  @Expose()
  avatar : string;

  @Expose()
  followerCount : number;

  @Expose()
  followeeCount : number;

  @Expose()
  verified : boolean;

  @Expose()
  // @Transform(({ obj }) => obj.followers.follower)
  @Type(() => mock)
  followers : Array<User>;

  @Expose()
  @Type(() => mock)
  followees : Array<User>;
}

