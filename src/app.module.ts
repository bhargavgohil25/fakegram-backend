import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// Users Module and Entities
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { UserFollowing } from './users/users-follow.entity';
// Posts Module and Entities
import { PostsModule } from './posts/posts.module';
import { Posts } from './posts/posts.entity';
import { CurrentUserMiddleware } from './users/middlewares/current-user.middleware';
// Hashtag module and entities
import { HashtagsModule } from './hashtags/hashtags.module';
import { Hashtags } from './hashtags/hashtags.entity';
// Likes Module and Entities
import { LikesModule } from './likes/likes.module';
import { Likes } from './likes/likes.entity';
// Comments Module and Entities
import { CommentsModule } from './comments/comments.module';
import { Comments } from './comments/comments.entity';
// Files Module and Entities
import { FilesModule } from './files/files.module';
import { PublicFile } from './files/public-file.entity';
import { PrivateFile } from './files/private-file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        UserFollowing,
        Posts,
        Hashtags,
        Likes,
        Comments,
        PublicFile,
        PrivateFile,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    HashtagsModule,
    LikesModule,
    CommentsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes(
        '**/current',
        { path: '/users/@:userName', method: RequestMethod.GET },
        { path: '/users/:userid/follow', method: RequestMethod.PUT },
        { path: '/users/avatar', method: RequestMethod.POST },
        { path: '/users/avatar', method: RequestMethod.DELETE },
        { path: '/users/:userid/followinfo', method: RequestMethod.GET },
        { path: '/users/updateprofile', method: RequestMethod.PATCH },
        { path: '/users/likedposts', method: RequestMethod.GET },
        { path: '/posts/', method: RequestMethod.POST },
        { path: '/posts/like', method: RequestMethod.POST },
        { path: '/posts/:userid/', method: RequestMethod.GET },
        { path: '/posts/files/:id', method: RequestMethod.GET },
        { path: '/comments/:postid/', method: RequestMethod.POST },
      );
  }
}
