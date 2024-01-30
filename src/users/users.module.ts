import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import Opinion from 'src/opinions/opinions.entity';
import { OpinionsService } from 'src/opinions/opinions.service';
import Product from 'src/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Opinion, Product])],
  controllers: [UsersController],
  providers: [UsersService, OpinionsService]
})
export class UsersModule { }
