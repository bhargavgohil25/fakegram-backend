import { Expose, Type } from "class-transformer";
import { User } from "../users.entity";

class mock {
  @Expose() id : string;
  @Expose() createdAt : Date;
  @Expose() updatedAt : Date;
  @Expose() name : string;
  @Expose() avatar : string;
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
  @Type(() => mock)
  followers : Array<User>;

  @Expose()
  @Type(() => mock)
  followees : Array<User>;
}

