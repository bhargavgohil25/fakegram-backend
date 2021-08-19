import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Hashtags } from 'src/hashtags/hashtags.entity';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Hashtags]),
    LikesModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
