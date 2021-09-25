import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../users/decorator/current-user.decorator';
import { User } from '../users/users.entity';
import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authentication-code.dto';

@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/signin')
  async signin(@Body() authLoginDto: AuthSigninDto) {
    return this.authService.signin(authLoginDto);
  }

  /**
   * @description Generates a QR code, which users can scan from there Google Authenticator app
   */
  @Post('/2fa/generate')
  @UseGuards(JwtAuthGuard)
  async register2fa(@Res() response: Response, @CurrentUser() user: User) {
    const { otpauthurl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        user,
      );

    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthurl);
  }

  @Post('/2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication (
    @CurrentUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthService.verifyTwoFactorAuthenticationCode(
        twoFactorAuthenticationCode,
        user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.usersService.turnOnTwoFactorAuthentication(user.id);
  }

  @Post('/2fa/authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @CurrentUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      this.twoFactorAuthService.verifyTwoFactorAuthenticationCode(
        twoFactorAuthenticationCode,
        user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Authentication Code Invalid');
    }
    
  }
}
