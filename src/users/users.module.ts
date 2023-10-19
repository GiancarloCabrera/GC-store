import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import Opinion from 'src/opinions/opinions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Opinion])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
