import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthSigninDto {

  @IsNotEmpty()
  @IsString()
  userName : string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}



