import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './products.entity';
import Keyword from 'src/keywords/keywords.entity';
import ProductImages from '../products-images/products-images.entity';
import Opinion from 'src/opinions/opinions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Keyword, ProductImages, Opinion])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
