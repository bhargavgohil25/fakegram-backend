import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtags } from './hashtags.entity';
import { Posts } from '../posts/posts.entity';

@Module({
  imports :[
    TypeOrmModule.forFeature([Hashtags, Posts]),
  ],
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}
