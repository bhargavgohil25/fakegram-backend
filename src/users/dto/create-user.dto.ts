import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { PublicFile } from '../../files/public-file.entity';

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
  bio: string;

  @IsString()
  avatar: PublicFile;

  @IsNumber()
  followerCount: number;

  @IsNumber()
  followeeCount: number;

  @IsBoolean()
  verified: boolean;
}
