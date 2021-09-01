import { Expose, Type } from 'class-transformer';
import { Point } from 'geojson';
import { Comments } from '../../comments/comments.entity';
import { Hashtags } from '../../hashtags/hashtags.entity';
import { User } from '../../users/users.entity';

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

class authorMock2 {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => authorMock)
  user: User;
}

class hashtagMock {
  @Expose()
  id: string;

  @Expose()
  hashtag: string;
}

class commentMock {
  @Expose()
  id: string;

  @Expose()
  commentBody: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => authorMock)
  user: User;
}

export class ReturnPostData {
  @Expose()
  id: string;

  @Expose()
  @Type(() => authorMock)
  author: User;

  @Expose()
  caption: string;

  @Expose()
  mentions ?: Array<string>;

  @Expose()
  images: Array<string>;

  @Expose()
  likesCount: number;

  @Expose()
  @Type(() => hashtagMock)
  hashtags: Array<Hashtags>;

  @Expose()
  @Type(() => authorMock2)
  likes: Array<User>;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  location: Point;

  @Expose()
  @Type(() => commentMock)
  comments: Array<Comments>;
}
