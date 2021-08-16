import { Injectable } from '@nestjs/common';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// Entities
import { Posts } from './posts.entity';
import { Hashtags } from '../hashtags/hashtags.entity';
// Dto's
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepo: Repository<Posts>,
    @InjectRepository(Hashtags)
    private hashtagRepo: Repository<Hashtags>,
  ) {}

  /**
   * @description create a new post
   * @Param {User} user - author of the post
   * @Param body - CreatePostDto
   */

  async createPost(creator : User, body: CreatePostDto) {
    if (!body.caption) {
      throw new BadRequestException('Post must contain some text');
    }

    // Extract hashtags from the post caption body
    const hashtags = body.caption.match(/\#\w+/g); // hashtags are the array of all hashtags in the post caption
    let hashtagsEntities : Array<Hashtags> = []; 

    // saving all the hashtags in the hashtag table.
    if(hashtags){
      for (const hashtag of hashtags) {
        const hashtagEntity = await this.hashtagRepo.findOne({ hashtag });
        // Check if there is any hashtag with the same name
        if (!hashtagEntity) {
          const newHashtag = await this.hashtagRepo.save({ hashtag });
          hashtagsEntities.push(newHashtag)
        }
      }
    }
    
    const post = new Posts();
    post.author = creator;
    post.caption = body.caption;
    post.images = body.images;
    post.hashtags = hashtagsEntities;

    const resPost = await this.postsRepo.save(post);

    return resPost;
  }

  async getPostsByUserId(userid: string) {
    const posts = await this.postsRepo.find({
      where: {
        author: userid,
      },
    });
    return posts;
  }
}
