import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthSigninDto } from './dto/auth-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(authSignin: AuthSigninDto) {
    const user = await this.validateUser(authSignin);

    const payload = {
      userId: user.id,
      userName: user.name,
      // userEmail : user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(authSignin: AuthSigninDto) {
    const { email, password } = authSignin;

    const user = await this.usersService.findByEmail(email);

    if (!(await this.usersService.validatePassword(password, email))) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verifyToken(token: string) {
    const resToken: string = token.split('Bearer ')[1];

    const user = await this.jwtService.verify(resToken);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('verifyToken');
    console.log(user);
    return user;
  }
}
