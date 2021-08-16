import { Expose, Type } from 'class-transformer';
import { User } from 'src/users/users.entity';

class authorMock {
  @Expose()
  id : string;

  @Expose()
  userName : string;

  @Expose()
  email : string;

  @Expose()
  bio : string;

  @Expose()
  verified : boolean;
}

export class ReturnPostData {

  @Expose()
  @Type(() => authorMock)
  author : User;

  @Expose()
  caption: string;
 
  @Expose()
  mentions : Array<string>;

  @Expose()
  images : Array<string>;

  @Expose()
  likesCount : number;

  @Expose()
  createdAt : Date;

  @Expose()
  updatedAt : Date;
}
