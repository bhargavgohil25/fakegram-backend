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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserFollowing)
    private userFollowingRepo: Repository<UserFollowing>,
    private jwtService: JwtService,
  ) {}

  /*
   * Create an Account
   * @Body(CreateUserDto)
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

  /*
   *  Create user- user relation
   *  @Param(userId) : To whom we are following
   */
  public async createUserFollowRelation(follower: User, followeeId: string) {
    const followee = await this.findById(followeeId);

    if (!followee) {
      throw new NotFoundException('User Not Found');
    }

    const newFollowee = await this.userFollowingRepo.save({
      follower,
      followee,
    });

    return newFollowee.followee;
  }

  /*
  * @Description: Followers and Followees of a Particular User
  * @Param(UserId) : Of whom we want to know the followers and followees
  */

  public async getUserFollowInfo(userid: string) {

    const info = await this.userRepo
      .createQueryBuilder('userFollowing')
      .select()
      .leftJoinAndSelect('userFollowing.followers','followers')
      .leftJoinAndSelect('userFollowing.followees', 'followees')
      .where('userFollowing.id = :userid', { userid })
      .getMany()

    return info
  }

  // public async getProfile(username: string) {
  //   const user = await this.userRepo
  //     .createQueryBuilder()
  //     .select('*')
  //     .from(User, 'users')
  //     // .leftJoinAndSelect();
  // }

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

  async validatePassword(password: string, email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    const currPassword = user.password;
    return bcrypt.compare(password, currPassword);
  }
}
