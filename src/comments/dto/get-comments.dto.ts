import { Expose, Transform, Type } from 'class-transformer';
import { User } from '../../users/users.entity';
import { Replies } from '../replies.entity';

abstract class baseDto {
  @Expose()
  id: string;
}

class userMock {
  @Expose()
  userName: string;

  @Expose()
  email: string;

  @Expose()
  bio: string;

  @Expose()
  verified: boolean;
}

class userNameMock {
  @Expose()
  userName : string;
}

class replyMock extends baseDto {
  @Expose()
  reply: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => userNameMock)
  @Expose()
  user : Partial<User>;
}

export class GetCommentsReturnDto {
  @Expose()
  id: string;

  @Expose()
  comment: string;

  @Expose()
  @Type(() => userMock)
  user: User;

  @Expose()
  @Type(() => replyMock)
  replies: Array<Replies>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
