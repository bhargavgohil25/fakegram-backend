import { Expose, Transform } from "class-transformer";


export class CommentsReturnDto {
  @Expose()
  id : string;
  
  @Expose()
  comment : string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  user: string;

  @Transform(({ obj }) => obj.post.id)
  @Expose()
  post: string;

  @Expose()
  createdAt : Date;

  @Expose()
  updatedAt : Date;
}


