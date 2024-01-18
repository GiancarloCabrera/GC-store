import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductImages from './products-images.entity';
import { ProductsImagesController } from './products-images.controller';
import { ProductImagesService } from './products-images.service';
import Product from 'src/products/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImages, Product])],
  controllers: [ProductsImagesController],
  providers: [ProductImagesService],
})
export class ProductsImagesModule {}
