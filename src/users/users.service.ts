import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserFollowing } from './users-follow.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserFollowing)
    private userFollowingRepo: Repository<UserFollowing>,
    private jwtService: JwtService,
  ) {}

  validate(userName: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(userName);
  }
  /**
   * @Description Create an Account
   * @Body (CreateUserDto)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const findUser = await this.findByEmail(createUserDto.email);

    if (findUser) {
      throw new BadRequestException('Email already Exist');
    }

    const findUserByName = await this.findByName(createUserDto.userName);

    if (findUserByName) {
      throw new BadRequestException('Username already Exist');
    }

    const userName = createUserDto.userName;
    if (!this.validate(userName)) {
      throw new BadRequestException(
        'Username should contain only numbers, alphabets and underscore',
      );
    }

    const user = this.userRepo.create(createUserDto);
    const newUser = await this.userRepo.save(user);

    return newUser;
  }

  /**
   *  @description Create user- user relation
   *  @Param (userId) : To whom we are following
   */
  public async createUserFollowRelation(follower: User, followeeId: string) : Promise<User> {
    const followee = await this.findById(followeeId);

    if (!followee) {
      throw new NotFoundException('User Not Found');
    }

    if (followee.id === follower.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const newFollowee = await this.userFollowingRepo.save({
      follower,
      followee,
    });

    return newFollowee.followee;
  }

  /**
   * @Description Followers and Followees of a Particular User
   * @Param (UserId) Of whom we want to know the followers and followees
   */
  public async getUserFollowInfo(userid: string, currentUser: string) : Promise<User[]> {
    // First check if the current user follows the userid User
    const ifFollow = await this.userFollowingRepo.findOne({
      where: {
        follower: {
          id: currentUser,
        },
        followee: {
          id: userid,
        },
      },
    });

    if (!ifFollow) {
      throw new BadRequestException('You are not following this user');
    }

    const info = this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.followers', 'followerstable')
      .leftJoinAndSelect('followerstable.follower', 'followers')
      .leftJoinAndSelect('users.followees', 'followeestable')
      .leftJoinAndSelect('followeestable.followee', 'followees')
      .where('users.id = :id', { id: userid })
      .getMany();
    return info;
  }

  /**
   * @Description Update the Profile (only the owner of the profile can update)
   * @Body (UpdateUserDto)
   * @param (userid)
   */
  public async updateUserProfile(
    userid: string,
    newUserDetail: UpdateUserDto,
  ): Promise<User> {
    const existingUser = await this.findById(userid);

    if (!existingUser) {
      return null;
    }

    const present = await this.findByName(newUserDetail.userName);

    if (present) {
      throw new BadRequestException(
        'This username is already taken, take another username',
      );
    }

    if (newUserDetail.userName) {
      existingUser.userName = newUserDetail.userName;
    }
    if (newUserDetail.bio) {
      existingUser.bio = newUserDetail.bio;
    }
    if (newUserDetail.avatar) {
      existingUser.avatar = newUserDetail.avatar;
    }
    if (newUserDetail.password) {
      existingUser.password = newUserDetail.password;
    }

    return await this.userRepo.save(existingUser);
  }

  async showById(id: number) {
    const user = await this.userRepo.findOne(id);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        email: email,
      },
    });
  }

  async findByName(userName: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        userName,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  async getUserByToken(token: string): Promise<User> {
    const resToken: string = token.split('Bearer ')[1];

    const user = await this.jwtService.verify(resToken);
    if (!user) {
      throw new UnauthorizedException('Invalid Password Or Email');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  /**
   * @description Check if the user is following the userid
   * @param (userId) : To whom we are following
   * @param (currentUser) : Who is following
  */
  async ifFollow(userId: string, currentUserId: string): Promise<boolean> {
    const ifFollow = await this.userFollowingRepo.findOne({
      where: {
        follower: {
          id: currentUserId,
        },
        followee: {
          id: userId,
        },
      },
    });

    if (ifFollow) {
      return true;
    }

    return false;
  }

  /**
   * @description Validate the database password and provided from user.
   * @params password : string, email : string
   */
  async validatePassword(password: string, email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    const currPassword = user.password;
    return bcrypt.compare(password, currPassword);
  }

  /**
   * @description get all the posts that are liked by the user
   * @param (userId) the current logged in user
   * @return (posts) 
   * @protected 🔒
   */
  async getLikedPosts(user: User) {
    const posts = await this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.likes', 'likes')
      .leftJoinAndSelect('likes.post', 'posts')
      .where('users.id = :userId', { userId: user.id })
      .orderBy('likes.createdAt', 'DESC')
      .getMany();

    return posts;
  }
}
