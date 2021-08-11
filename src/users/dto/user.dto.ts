import { Expose } from "class-transformer";
import { User } from "../users.entity";

interface mock {
  id : string;
  createdAt : Date;
  updatedAt : Date;
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
  followers : Array<mock | User>;

  @Expose()
  followees : Array<mock | User>;
}

