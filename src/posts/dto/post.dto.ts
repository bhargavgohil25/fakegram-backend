import { Expose, Type } from 'class-transformer';
import { Point } from 'geojson';
import { PrivateFile } from '../../files/private-file.entity';
import { Comments } from '../../comments/comments.entity';
import { Hashtags } from '../../hashtags/hashtags.entity';
import { User } from '../../users/users.entity';

abstract class baseDto{
  @Expose()
  id: string;
}

class authorMock extends baseDto {
  @Expose()
  userName: string;

  @Expose()
  email: string;

  @Expose()
  bio: string;

  @Expose()
  verified: boolean;
}

class authorMock2 extends baseDto{
  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => authorMock)
  user: User;
}

class hashtagMock extends baseDto {
  @Expose()
  hashtag: string;
}

class commentMock extends baseDto {

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

class ImageDto extends baseDto {
  @Expose()
  key: string;

  @Expose()
  url: string;
}

export class ReturnPostData extends baseDto {
  @Expose()
  @Type(() => authorMock)
  author: User;

  @Expose()
  caption: string;

  @Expose()
  mentions ?: Array<string>;

  @Expose()
  @Type(() => ImageDto)
  images: Array<PrivateFile>;

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
