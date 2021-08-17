import { Expose, Type, Transform, Exclude } from "class-transformer";
import { Posts } from "../../posts/posts.entity";

@Expose()
class mockPosts {
  @Expose()
  id : string;

  @Expose()
  createdAt : Date;
  
  @Expose()
  updatedAt : Date;
  
  @Expose()
  caption : string;
  
  @Expose()
  images : string;
  
  @Expose()
  mentions : Array<string>;
  
  @Expose()
  likeCount : number;
}

export class HashtagDto {
  @Expose()
  id : string;

  @Expose()
  createdAt : Date;
  
  @Expose()
  hashtag : string;
  
  @Expose()
  @Type(() => mockPosts)
  posts: Posts[];
}

