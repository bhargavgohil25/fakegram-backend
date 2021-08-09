import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const findUser = await this.findByEmail(createUserDto.email);

    if (findUser) {
      throw new BadRequestException('Email already Exist');
    }

    const user = this.userRepo.create(createUserDto);
    await user.save();

    return user;
  }

  async showById(id: number) {
    const user = this.userRepo.findOne(id);

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email: email,
      },
    });
  }

  // Methods : Unusable
  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async remove(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async validatePassword(password: string, email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    const currPassword = user.password;
    return bcrypt.compare(password, currPassword);
  }
}
