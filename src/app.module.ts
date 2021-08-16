import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { UserFollowing } from './users/users-follow.entity';
import { PostsModule } from './posts/posts.module';
import { Posts } from './posts/posts.entity';
import { CurrentUserMiddleware } from './users/middlewares/current-user.middleware';
import { HashtagsModule } from './hashtags/hashtags.module';
import { Hashtags } from './hashtags/hashtags.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, UserFollowing, Posts, Hashtags],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    HashtagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes(
      '**/current',
      { path : '/users/@:userName', method: RequestMethod.GET },
      { path : '/users/:userid/follow', method: RequestMethod.PUT },
      { path : '/users/updateprofile', method: RequestMethod.PATCH },
      { path : '/posts/', method: RequestMethod.POST }
      // '*'
    );
  }
}
