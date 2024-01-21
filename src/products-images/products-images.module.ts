import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductImages from './products-images.entity';
import { ProductsImagesController } from './products-images.controller';
import { ProductImagesService } from './products-images.service';
import Product from 'src/products/products.entity';
import { S3Service } from 'src/S3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImages, Product])],
  controllers: [ProductsImagesController],
  providers: [ProductImagesService, S3Service]
})
export class ProductsImagesModule { }
