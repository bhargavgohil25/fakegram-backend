import { Controller, Get, Query } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { HashtagDto } from './dto/hashtags.dto';
import { HashtagsService } from './hashtags.service';
import { Hashtags } from './hashtags.entity';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('posts?')
  @Serialize(HashtagDto)
  async getAllPostsWithTag(@Query('tag') tag: string): Promise<Hashtags[]> {
    return this.hashtagsService.getAllPostsWithTag(`#${tag}`);
  }

  @Get('explore')
  async getTopHashtags() {
    return this.hashtagsService.getTopHashtags();
  }
}
