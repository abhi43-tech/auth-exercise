import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { PasswordService } from 'src/password/password.service';
import { CreateUserDto } from 'src/dto/user.dto';

export type User1 = {
  id: number;
  name: string;
  username: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, private readonly passwordService: PasswordService) {}

  async findOne(username: string): Promise<User> {
    return await  this.userRepo.findOne({where: {username}})
  }

  async findToken(token: string): Promise<User> {
    return await  this.userRepo.findOne({where: {refreshToken: token}})
  }

  async createUser(user: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({where: {username: user.username}});
    if(existingUser) throw new BadRequestException('User already exist with same username.');
    const hashPass = await this.passwordService.hashPassword(user.password)
    const newUser = await this.userRepo.create({
      ...user,
      password: hashPass,
    });
    await this.userRepo.save(newUser)
    return {
      message: 'User register successfully.',
      id : newUser.id
    }
  }

  async updateUser(id, data) {
    return await this.userRepo.update(id, {refreshToken: data});
  }

  async findEmail(email: string) {
    const user = await this.userRepo.findOne({where: {email: email}})
    if(!user) return null
    return user;
  }
}
