import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthSigninDto } from './dto/auth-signin.dto';

interface TokenPayload {
  userId: string;
  isSecondFactorAuthenticated: boolean;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signin(authSignin: AuthSigninDto) {
    const user = await this.validateUser(authSignin);

    const payload = {
      userId: user.id,
      userName: user.userName,
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
      throw new UnauthorizedException('Invalid Paaword Or Email');
    }

    return user;
  }

  async verifyToken(token: string) {
    const resToken: string = token.split('Bearer ')[1];

    const user = await this.jwtService.verify(resToken);
    if (!user) {
      throw new UnauthorizedException('Invalid Paaword Or Email');
    }
    // console.log('verifyToken');
    // console.log(user);
    return user;
  }

  async getCookieWithJwtAccessToken(
    userId: string,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }
}
