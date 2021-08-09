import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthSigninDto {

  @IsNotEmpty()
  name : string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}



