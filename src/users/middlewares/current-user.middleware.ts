import {
  forwardRef,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../auth/auth.service';
import { User } from '../users.entity';
import { UsersService } from '../users.service';

interface RequestId extends Request {
  id: string;
  userInfo : User
}

interface PayloadIncoming {
  userId: string;
  userName: string;
  iat: string;
  userEmail: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: RequestId, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    // console.log(token);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const { userId } =
        await this.usersService.getUserByToken(token);
      
      const user = await this.usersService.findById(userId);
      
      console.log(user)
      req.userInfo = user;
      req.id = userId;
      next();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
