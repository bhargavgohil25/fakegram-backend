import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../posts/posts.entity';
import { getRepository, Repository } from 'typeorm';
import { Hashtags } from './hashtags.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtags)
    private hashtagsRepo: Repository<Hashtags>,
    @InjectRepository(Posts)
    private postsRepo: Repository<Posts>,
  ) {}

  /**
   * @description - get all the post for particular tag 
   * @param tag
  */
  async getAllPostsWithTag(tag: string) {
    // console.log(tag)
    const posts = await this.hashtagsRepo.find({
      where: {
        hashtag: tag,
      },
      relations: ['posts'],
      order: {
        createdAt: 'DESC',
      },
      take: 50,
    });
    return posts;
  }

  async getTopHashtags() {
    // const res = await getRepository('posts_hashtags_relation')
    //   .createQueryBuilder('rel')
    //   .select('COUNT(*) as count')
    //   .leftJoinAndSelect('rel.hashtag_id', 'tags')
    //   .groupBy('tags.hashtag')
    //   .getMany();

    const res = await getRepository('posts_hashtags_relation').query(
      'SELECT COUNT(*) as count_tags, hashtag FROM posts_hashtags_relation rel LEFT JOIN hashtags ON rel.hashtag_id = hashtags.id GROUP BY hashtag ORDER BY count_tags desc;',
    );

    return res;
  }
}
