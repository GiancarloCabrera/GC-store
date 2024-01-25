import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductImages from './products-images.entity';
import { Repository } from 'typeorm';
import { CreateProductImageDto } from './dto/create-product-images';
import Product from 'src/products/products.entity';
import { UpdateProductImageDto } from './dto/update-product-image';
import { S3Service } from 'src/S3/s3.service';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImages)
    private productImagesRepository: Repository<ProductImages>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private S3Service: S3Service
  ) { }

  async createProductImage(file: Express.Multer.File, product_id: number) {
    try {
      const product_found = await this.productRepository.findOne({
        where: {
          id: product_id,
        },
      });

      if (!product_found) throw new BadRequestException('Product not found...');

      // Uploading file in S3
      let s3 = await this.S3Service.uploadS3(file.originalname.trim(), file.buffer)
      console.log(s3);
      if (s3.file.httpStatusCode !== 200) throw new BadRequestException('Image could not be saved...');
      let new_img = new ProductImages();
      new_img.path = s3.file.url;
      // // Making relation
      new_img.product = product_found;

      return await this.productImagesRepository.save(new_img);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductImage(id: number) {
    try {
      const found_img = await this.findProductImageById(id);

      if (!found_img) throw new BadRequestException('Image not found...');
      console.log(found_img);
      const fileName = found_img.path.substring(found_img.path.lastIndexOf("/") + 1);
      console.log(fileName);

      const s3 = await this.S3Service.deleteS3(fileName);
      console.log('er: ', s3);

      if (s3.$metadata?.httpStatusCode === 404) return s3;

      return await this.productImagesRepository.remove(found_img);
    } catch (error) {
      throw error;
    }
  }

  async updateProductImage(image: UpdateProductImageDto) {
    try {
      const p_id = image.productId ? image.productId : null;
      const found_img = await this.productImagesRepository.findOne({
        relations: {
          product: true,
        },
        where: {
          id: image.id,
          product: { id: p_id },
        },
      });

      if (!found_img)
        throw new BadRequestException(
          `Image ${image.id} not found or its product Id does not belong to it... `,
        );
      Object.assign(found_img, image);

      return await this.productImagesRepository.save(found_img);
    } catch (error) {
      throw error;
    }
  }

  async findProductImageById(id: number) {
    try {
      const found_img = await this.productImagesRepository.findOne({
        where: {
          id,
        },
      });

      if (!found_img) throw new BadRequestException('Image not found...');
      return found_img;
    } catch (error) {
      throw error;
    }
  }

  async getAllProductImages(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const [images, total] = await this.productImagesRepository.findAndCount({
        skip,
        take: limit,
      });
      const total_pages = Math.ceil(total / limit);
      const has_next_page = page < total_pages;

      return {
        images,
        total,
        page,
        total_pages,
        has_next_page,
      };
    } catch (error) {
      throw error;
    }
  }
}
