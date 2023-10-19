import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductImages from './products-images.entity';
import { Repository } from 'typeorm';
import { CreateProductImagesDto } from './dto/create-product-images';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImages) private productImagesRepository: Repository<ProductImages>,
  ) { }

  async createProductImages({ images }: CreateProductImagesDto) {
    try {

      // PRODUCT IMAGES
      const p_images = [];
      for (const img of images) {
        let p_img = new ProductImages();
        p_img.path = img;
        p_img = await this.productImagesRepository.save(p_img);
        p_images.push(p_img);
      }
      return p_images;
    } catch (error) {

    }
  }
}
