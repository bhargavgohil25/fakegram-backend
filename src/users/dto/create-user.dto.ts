import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  bio : string;

  @IsString()
  avatar : string;

  @IsNumber()
  followerCount : number;

  @IsNumber()
  followeeCount : number;

  @IsBoolean()
  verified : boolean;

}
