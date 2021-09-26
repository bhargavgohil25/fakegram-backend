import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export default class JwtTwoFactorGuard extends AuthGuard('jwt-two-factor') {}

// Use this guard for Two-Factor-Authentication and logging in with two factor authentication....
