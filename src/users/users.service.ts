import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, getRepository, Repository } from 'typeorm';
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

  /**
   * @Description Create an Account
   * @Body (CreateUserDto)
   */

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.findByEmail(createUserDto.email);

    if (findUser) {
      throw new BadRequestException('Email already Exist');
    }

    const findUserByName = await this.findByName(createUserDto.userName);

    if (findUserByName) {
      throw new BadRequestException('Username already Exist');
    }

    const user = this.userRepo.create(createUserDto);
    const newUser = await this.userRepo.save(user);

    return newUser;
  }

  /**
   *  @description Create user- user relation
   *  @Param (userId) : To whom we are following
   */
  public async createUserFollowRelation(follower: User, followeeId: string) {
    const followee = await this.findById(followeeId);

    if (!followee) {
      throw new NotFoundException('User Not Found');
    }

    if(followee.id === follower.id){
      throw new BadRequestException("You cannot follow yourself")
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
  public async getUserFollowInfo(userid: string) {

    const info = this.userRepo.find({
      where: {
        id: userid,
      },
      relations: [
        'followers',
        'followees',
        'followers.follower',
        'followees.followee',
      ],
    });
    return info;
  }

  /**
   * @Description Update the Profile (only the owner of the profile can update)
   * @Body (UpdateUserDto) 
   * @param (userid)
  */
  public async updateUserProfile(userid : string , newUserDetail : UpdateUserDto) {
    const existingUser = await this.findById(userid)

    if(!existingUser){
      return null;
    }

    const present = await this.findByName(newUserDetail.userName);

    if(present) {
      throw new BadRequestException("This username is already taken, take another username")
    }

    if(newUserDetail.userName){
      existingUser.userName = newUserDetail.userName
    }
    if(newUserDetail.bio){
      existingUser.bio = newUserDetail.bio;
    }
    if(newUserDetail.avatar){
      existingUser.avatar = newUserDetail.avatar;
    }
    if(newUserDetail.password){
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

  async getUserByToken(token: string) {
    const resToken: string = token.split('Bearer ')[1];

    const user = await this.jwtService.verify(resToken);
    if (!user) {
      throw new UnauthorizedException('Invalid Password Or Email');
    }

    return user;
  }

  // Methods : Unusable

  async remove(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  /**
   *  @Description Validate the database password and provided from user.
   * @Params password : string, email : string
  */
  async validatePassword(password: string, email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    const currPassword = user.password;
    return bcrypt.compare(password, currPassword);
  }
}
