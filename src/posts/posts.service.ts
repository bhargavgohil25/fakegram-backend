import { Injectable, NotAcceptableException } from '@nestjs/common';
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
import { FilesService } from '../files/files.service';
import { PrivateFile } from '../files/private-file.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepo: Repository<Posts>,
    @InjectRepository(Hashtags)
    private hashtagRepo: Repository<Hashtags>,
    private usersService: UsersService,
    private privateFilesService: FilesService,
  ) {}

  /**
   * @description create a new post
   * @param {User} user - author of the post
   * @param body - CreatePostDto
   * @returns {Promise<Posts> Post
   */

  async createPost(
    creator: User,
    body: CreatePostDto,
    files: Array<Express.Multer.File>
  ) {
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
    // post.images = body.images;
    post.hashtags = hashtagsEntities;
    post.location = pointObject;

    const resPost = await this.postsRepo.save(post);

    // Post image implememntation
    const newFile = await this.addPrivatePostImages(
      creator,
      resPost,
      files
    );
    resPost.images = newFile;

    return resPost;
  }

  // Helper Method for posting images
  async addPrivatePostImages(
    user: User,
    post: Posts,
    files: Array<Express.Multer.File>
  ): Promise<PrivateFile[]> {
    return this.privateFilesService.uploadPrivateFile(
      post,
      user,
      files
    );
  }

  /**
   * @description Get the private file as a stream (not recommended)
   * @param userid
   * @param fileid
   * @returns PrivateFile entity of the file
   */
  // it can be accessed only by the someone who follows the post author and self also
  async getPrivateFile(userid: string, fileid: string) {
    const file = await this.privateFilesService.getPrivateFile(fileid);
    // console.log(file);
    //check the follow constraint, i.e the file uploaded cn be accessed or not
    // the author of the post can access those files/images
    const canFollow: Promise<boolean> = this.usersService.ifFollow(
      file.info.user.id,
      userid,
    );

    const samePerson = userid === file.info.user.id ? true : false;

    if (!canFollow || !samePerson) {
      throw new BadRequestException("You don't follow author of this post");
    }

    return file;
  }

  /**
   * @description Get private images of a post
   * @param postid
   * @returns Array of PrivateFile entities
   * @throws NotAcceptableException
   */

  async getPrivateFileUrl(postid: string, userid: string) {
    const postImages = await this.postsRepo.findOne(
      { id: postid },
      { relations: ['images'] },
    );

    if (postImages) {
      return Promise.all(
        postImages.images.map(async (image) => {
          const url = await this.privateFilesService.generatePresignedUrl(
            image.key,
          );
          // console.log(url);
          return {
            ...image,
            url,
          };
        }),
      );
    }
    throw new NotAcceptableException('Post with this id not found');
  }

  /**
   * @description get all the posts of user
   * @param {userid} userid
   * @returns {Promise<Posts[]> Posts[]
   */

  async getPostsByUserId(userid: string, currentUserId: string) {
    const canFollow: Promise<boolean> = this.usersService.ifFollow(
      userid,
      currentUserId,
    );

    const samePerson = userid === currentUserId ? true : false;

    if (!canFollow || !samePerson) {
      throw new BadRequestException("You don't follow author of this post");
    }

    const posts = await this.postsRepo
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.hashtags', 'hashtag')
      .leftJoinAndSelect('posts.likes', 'likes')
      .leftJoinAndSelect('likes.user', 'users')
      .addSelect('hashtag.hashtag')
      .where('posts.author = :userid', { userid })
      .addSelect('posts.created_at')
      .orderBy('posts.created_at', 'DESC')
      .limit(100)
      .getMany();

    // This will be used to get the images of the post (for both single and multiple images)
    const newPosts = posts.map(async (post) => {
      const images = await this.getPrivateFileUrl(post.id, currentUserId);
      post.images = images;
      return {
        ...post,
      };
    });
    const res = Promise.all(newPosts);

    return res;
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
