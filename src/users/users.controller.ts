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
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from './decorator/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put('/:userid/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @CurrentUser() follower : User,
    @Param('userid') followeeId : string 
  ) {
    const followedUser = await this.usersService.createUserFollowRelation(
      follower,
      followeeId
    );

    return followedUser;
  }

  @Get('/:userid/followinfo')
  async followInfo(@Param('userid') userid : string) {
    const result = await this.usersService.getUserFollowInfo(userid);
    console.log(result)
    return result;
  }

  //! Testing for current user
  @Get('/current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserId(@CurrentUser() user : User) {
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
