import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsNotEmpty()
  @IsString()
  userName ?: string;

  @IsString()
  password ?: string;

  @IsString()
  bio ?: string;

  @IsString()
  avatar ?: string;
}
