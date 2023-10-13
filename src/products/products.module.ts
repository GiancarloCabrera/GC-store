import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './products.entity';
import { KeywordsService } from 'src/keywords/keywords.service';
import Keyword from 'src/keywords/keywords.entity';
import ProductImages from '../products-images/products-images.entity';
import { ProductImagesService } from 'src/products-images/products-images.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Keyword, ProductImages])],
  controllers: [ProductsController],
  providers: [ProductsService, KeywordsService, ProductImagesService]
})
export class ProductsModule { }
