import { Expose } from "class-transformer";

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
}

