import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CommentsBodyDto {
  @IsString()
  @MaxLength(350)
  commentBody: string;

  @IsString()
  @IsUUID('all')
  parentCommentId ?: string;
}
