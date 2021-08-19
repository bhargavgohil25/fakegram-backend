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
} from '@nestjs/common';
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

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  /**
   * @Body(CreateUserDto)
   * @Description(signups a new user)
   */
  
  @Post('/signup')
  @Serialize(UserDto)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * @Params(userid : string)
   * @Description(followers a user with id = userid)
   * @Returns(followedUser : User)
   */

  @Put('/:userid/follow')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async followUser(
    @CurrentUser() follower: User,
    @Param('userid') followeeId: string,
  ) : Promise<User> {
    const followedUser = await this.usersService.createUserFollowRelation(
      follower,
      followeeId,
    );

    return followedUser;
  }

  /**
   * @Params(userid : string)
   * @Description(gets all the following Info of a user with id = userid)
   * @Returns(followingInfo : Array<User>)
   */

  @Get('/:userid/followinfo')
  @Serialize(UserDto)
  async followInfo(@Param('userid') userid: string) {
    const result = await this.usersService.getUserFollowInfo(userid);
    return result;
  }

  @Patch('/updateprofile')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async updateUserProfile(
    @CurrentUser() user : User,
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
  async getUserByUsername(@Param('userName') userName: string) : Promise<User> {
    const user = await this.usersService.findByName(userName);
    // console.log(userName);
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
  async getUserById(@Param('id') id: string) : Promise<User> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  
}
