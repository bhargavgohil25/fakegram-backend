import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class CreateLogDto {
  @IsNotEmpty()
  @IsString()
  context: string;
  
  @IsString()
  message: string;

  @IsString()
  level: string;
}
