import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

interface RequestId extends Request {
  id: string;
  userInfo: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CurrentUserMiddleware.name);

  constructor(private usersService: UsersService) {}

  async use(req: RequestId, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    // console.log(token);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const { userId } = await this.usersService.getUserByToken(token);

      const user = await this.usersService.findById(userId);

      // console.log(user)
      req.userInfo = user;
      req.id = userId;
      next();
    } catch {
      this.logger.error("Something is broken in Current User Middleware");
      throw new UnauthorizedException();
    }
  }
}
