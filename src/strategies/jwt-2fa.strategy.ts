import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

interface TokenPayload {
  userId: string;
  isSecondFactorAuthenticated: boolean;
}

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(
    private readonly usersService : UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: TokenPayload) {

    const user = await this.usersService.findById(payload.userId);

    if(!user.isTwoFactorAuhenticationEnabled){
      return user;
    }

    if(payload.isSecondFactorAuthenticated){
      return user;
    }

    // return {
    //   userId: payload.userId,
    //   userName: payload.userName,
    //   // userEmail: payload.userEmail
    // };
  }
}
