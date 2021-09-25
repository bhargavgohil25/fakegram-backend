import { IsString, MaxLength, MinLength } from 'class-validator';

export class CommentsBodyDto {
  @IsString()
  @MaxLength(350,{
    message: 'Comment must be less than 350 characters'
  })
  @MinLength(1,{
    message: 'Comment must be at least 1 character long'
  })
  text: string;

  @IsString()
  parentCommentId ?: string;
}
