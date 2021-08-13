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
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

// Entities
import { User } from './users.entity';

// Services
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * @Body(CreateUserDto)
   * @Description(signups a new user)
   */

  @Post('/signup')
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
  async followUser(
    @CurrentUser() follower: User,
    @Param('userid') followeeId: string,
  ) {
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
  async followInfo(@Param('userid') userid: string) {
    const result = await this.usersService.getUserFollowInfo(userid);
    return result;
  }

  @Patch('/updateprofile')
  @UseGuards(JwtAuthGuard)
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
  async getCurrentUserId(@CurrentUser() user: User) {
    console.log('running endpoint');
    return user;
  }

  @Get('/@:userName')
  async getUserByUsername(@Param('userName') userName: string) {
    const user = await this.usersService.findByName(userName);
    // console.log(userName);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  @Get('/:id')
  // @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }
}
