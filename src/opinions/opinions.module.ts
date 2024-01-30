import { Module } from '@nestjs/common';
import { OpinionsController } from './opinions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Opinion from './opinions.entity';
import { OpinionsService } from './opinions.service';
import Product from 'src/products/products.entity';
import User from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opinion, Product, User])],
  controllers: [OpinionsController],
  providers: [OpinionsService],
})
export class OpinionsModule { }
