import { Delete, UploadedFile } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  NotFoundException,
  Patch,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// Interceptors
import { Serialize } from '../interceptors/serialize.interceptor';

// Decorators
import { CurrentUser } from './decorator/current-user.decorator';

// Dto's
import { CreateUserDto } from './dto/create-user.dto';
import { LikedPostDto } from './dto/liked-posts.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

// Entities
import { User } from './users.entity';

// Services
import { UsersService } from './users.service';

import { Express } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * @Body(CreateUserDto)
   * @Description(signups a new user)
   */

  @Post('/signup')
  @Serialize(UserDto)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * @params (userid : string)
   * @description (follows a user with id = userid)
   * @returns (followedUser : User)
   */

  @Put('/:userid/follow')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async followUser(
    @CurrentUser() follower: User,
    @Param('userid') followeeId: string,
  ): Promise<User | { message: string }> {
    const result = await this.usersService.createUserFollowRelation(
      follower,
      followeeId,
    );

    return result;
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {

    // check the extension of the file and valid extension can only go further
    const extension = file.originalname.split('.').slice(-1)[0];
    if(extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
      throw new NotFoundException('File extension is not valid');
    }

    return this.usersService.addAvatar(user.id, file.buffer, file.originalname);
  }

  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@CurrentUser() user: User) : Promise<string> {
    return this.usersService.deleteAvatar(user.id);
  }

  /**
   * @params (userid : string)
   * @description (gets all the following Info of a user with id = userid)
   * @returns (followingInfo : Array<User>)
   */

  @Get('/:userid/followinfo')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async followInfo(@Param('userid') userid: string, @CurrentUser() user: User) {
    const result = await this.usersService.getUserFollowInfo(userid, user.id);
    return result;
  }

  @Patch('/updateprofile')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async updateUserProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const resUser = this.usersService.updateUserProfile(user.id, updateUserDto);

    return resUser;
  }

  //! Testing for current user
  @Get('/current')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async getCurrentUserId(@CurrentUser() user: User) {
    console.log('running endpoint');
    return user;
  }

  @Get('/@:userName')
  @Serialize(UserDto)
  async getUserByUsername(@Param('userName') userName: string): Promise<User> {
    const user = await this.usersService.findByName(userName);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Get('/likedposts')
  @UseGuards(JwtAuthGuard)
  @Serialize(LikedPostDto)
  async getLikedPosts(@CurrentUser() user: User) {
    return this.usersService.getLikedPosts(user);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }
}
