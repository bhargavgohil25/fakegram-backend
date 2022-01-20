import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// Users Module and Entities
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// Posts Module and Entities
import { PostsModule } from './posts/posts.module';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import LogsMiddleware from './middleware/logs.middleware';
// Hashtag module and entities
import { HashtagsModule } from './hashtags/hashtags.module';
// Likes Module and Entities
import { LikesModule } from './likes/likes.module';
// Comments Module and Entities
import { CommentsModule } from './comments/comments.module';
// Files Module and Entities
import { FilesModule } from './files/files.module';
// database logger modules and entities
import DatabaseLogger from './database/databaseLogger';
import { LoggerModule } from './logs/logger.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        logger: new DatabaseLogger(),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    PostsModule,
    HashtagsModule,
    LikesModule,
    CommentsModule,
    FilesModule,
    LoggerModule,
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
        { path: '/users/2fa/generate', method: RequestMethod.POST },
        { path: '/users/2fa/turn-on', method: RequestMethod.POST },
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
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
