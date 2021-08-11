import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserFollowing } from './users-follow.entity';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserFollowSubscriber } from './subscribers/user-follow.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFollowing]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, UserFollowSubscriber],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes(
      '**/current',
      { path : '/users/@:userName', method: RequestMethod.GET },
      { path : '/users/:userid/follow', method: RequestMethod.PUT },
      // '*'
    );
  }
}
