import { Expose, Type } from 'class-transformer';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { User } from 'src/users/users.entity';

class authorMock {
  @Expose()
  id: string;

  @Expose()
  userName: string;

  @Expose()
  email: string;

  @Expose()
  bio: string;

  @Expose()
  verified: boolean;
}

class hashtagMock {
  @Expose()
  id: string;

  @Expose()
  hashtag: string;
}

export class ReturnPostData {
  @Expose()
  @Type(() => authorMock)
  author: User;

  @Expose()
  caption: string;

  @Expose()
  mentions: Array<string>;

  @Expose()
  images: Array<string>;

  @Expose()
  likesCount: number;

  @Expose()
  @Type(() => hashtagMock)
  hashtags: Array<Hashtags>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
