import { Expose, Type } from "class-transformer";
import { Posts } from "../../posts/posts.entity";
import { Likes } from "../../likes/likes.entity";

class Base {
  @Expose()
  id : string;
  @Expose()
  createdAt : Date;
  @Expose()
  updatedAt : Date;
}

class postMock extends Base {
  @Expose()
  caption : string;
  @Expose()
  images : Array<string>;
  @Expose()
  repostCounts : number;
  @Expose()
  mentions : Array<string>;
}

class likesMock extends Base{
  @Expose()
  @Type(() => postMock)
  post : Posts
}

export class LikedPostDto {
  @Expose()
  @Type(() => likesMock)
  likes : Array<Likes>
}
