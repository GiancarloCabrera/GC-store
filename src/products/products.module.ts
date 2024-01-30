import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './products.entity';
import Keyword from 'src/keywords/keywords.entity';
import ProductImages from '../products-images/products-images.entity';
import Opinion from 'src/opinions/opinions.entity';
import { ProductImagesService } from 'src/products-images/products-images.service';
import { S3Service } from 'src/S3/s3.service';
import { KeywordService } from 'src/keywords/keywords.service';
import { OpinionsService } from 'src/opinions/opinions.service';
import User from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Keyword, ProductImages, Opinion, User]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductImagesService, S3Service, KeywordService, OpinionsService]
})
export class ProductsModule { }
