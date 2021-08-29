import { Expose, Transform } from "class-transformer";


export class CommentsReturnDto {
  @Expose()
  commentBody : string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  user: string;

  @Transform(({ obj }) => obj.post.id)
  @Expose()
  post: string;

  @Expose()
  id : string;

  @Expose()
  createdAt : Date;

  @Expose()
  updatedAt : Date;
}


