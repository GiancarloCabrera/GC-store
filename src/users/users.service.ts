import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUSerDto } from './dto/update-user.dto';
import { OpinionsService } from 'src/opinions/opinions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private opinionsService: OpinionsService
  ) { }

  async createUser(user: CreateUserDto) {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          username: user.username,
        },
      });

      if (userFound)
        return new HttpException('User already exists', HttpStatus.NOT_FOUND);

      const newUser = this.userRepository.create(user);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(id: number) {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          id,
        },
      });

      if (!userFound) return new HttpException('User not found', HttpStatus.NOT_FOUND);

      return userFound;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const user_found = await this.userRepository.findOne({
        relations: {
          opinions: true,
        },
        where: {
          id,
        },
      });
      console.log(user_found);
      if (!user_found) throw new BadRequestException('User not found...');

      // Delete user opinions
      if (user_found.opinions.length) user_found.opinions.forEach(async (op) => await this.opinionsService.deleteOpinion(op.id));

      return await this.userRepository.remove(user_found);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, user: UpdateUSerDto) {
    try {
      const userFound = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!userFound)
        return new HttpException('User not found', HttpStatus.NOT_FOUND);

      const updUser = Object.assign(userFound, user);
      return await this.userRepository.save(updUser);
    } catch (error) {
      throw error;
    }
  }
}
