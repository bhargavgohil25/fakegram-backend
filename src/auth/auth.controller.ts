import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/auth-signin.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() authLoginDto: AuthSigninDto) {
    return this.authService.signin(authLoginDto);
  }

  // @Get('/profile')
  // @UseGuards(JwtAuthGuard)
  // getProfile(@Request() req) {
  //   const { userId, userName } = req;
  //   return {
  //     id: userId,
  //     name: userName,
  //   };
  // }
}
