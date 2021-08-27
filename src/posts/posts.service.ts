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
import { UsersService } from '../users/users.service';
import { Point } from 'geojson';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepo: Repository<Posts>,
    @InjectRepository(Hashtags)
    private hashtagRepo: Repository<Hashtags>,
    private usersService: UsersService,
  ) {}

  /**
   * @description create a new post
   * @param {User} user - author of the post
   * @param body - CreatePostDto
   * @returns {Promise<Posts> Post
   */

  async createPost(creator: User, body: CreatePostDto) {
    if (!body.caption) {
      throw new BadRequestException('Post must contain some text');
    }

    // Extract hashtags from the post caption body
    const hashtags = body.caption.match(/\#\w+/g); // hashtags are the array of all hashtags in the post caption
    let hashtagsEntities: Array<Hashtags> = [];

    // saving all the hashtags in the hashtag table.
    if (hashtags) {
      for (const hashtag of hashtags) {
        const hashtagEntity: Hashtags = await this.hashtagRepo.findOne({
          hashtag,
        });
        // Check if there is any hashtag with the same name
        let newHashtag: Hashtags;
        if (!hashtagEntity) {
          // If no hashtag with the same name, create a new hashtag
          newHashtag = await this.hashtagRepo.save({ hashtag });
          // push the new hashtag to the array of hashtagsEntities
          hashtagsEntities.push(newHashtag);
        } else {
          // just push the existing hashtag to the array of hashtagsEntities
          hashtagsEntities.push(hashtagEntity);
        }
      }
    }

    const pointObject: Point = {
      type: 'Point',
      coordinates: [body.longitude, body.latitude],
    };

    // const post = new Posts();
    const post = this.postsRepo.create();
    post.author = creator;
    post.caption = body.caption;
    post.images = body.images;
    post.hashtags = hashtagsEntities;
    post.location = pointObject;

    const resPost = await this.postsRepo.save(post);

    return resPost;
  }

  /**
   * @description get all the posts of user
   * @param {userid} userid
   * @returns {Promise<Posts[]> Posts[]
   */

  async getPostsByUserId(userid: string, currentUserId: string) {
    // Check if he follows that user

    const ifFollow = await this.usersService.ifFollow(userid, currentUserId);

    if (!ifFollow) {
      throw new BadRequestException('You are not following this user');
    }

    const posts = await this.postsRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.hashtags', 'hashtag')
      .leftJoinAndSelect('posts.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'users')
      .addSelect('hashtag.hashtag')
      .where('posts.author = :userid', { userid });

    return posts
      .addSelect('posts.created_at')
      .orderBy('posts.created_at', 'DESC')
      .limit(100)
      .getMany();
  }

  /**
   * @description get a single post by its id
   */

  async getPostsById(postid: string): Promise<Posts> {
    const post = await this.postsRepo.findOne({
      where: {
        id: postid,
      },
    });

    return post;
  }
}
