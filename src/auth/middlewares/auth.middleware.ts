import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

interface RequestId extends Request {
  userId: string;
  userName: string;
}

interface PayloadIncoming {
  userId: string;
  userName: string;
  iat: string;
  userEmail: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(req: RequestId, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    // console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    console.log('done token');
    try {
      const { userId, userName }: PayloadIncoming =
        await this.authService.verifyToken(token);
      // console.log(userId);
      req.userId = userId;
      req.userName = userName;
      next();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
