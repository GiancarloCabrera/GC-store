import { Body, Controller, Post } from '@nestjs/common';
import { ProductImagesService } from './products-images.service';

@Controller('products-images')
export class ProductsImagesController {
  constructor(private productImagesService: ProductImagesService) { }

  @Post()
  createProduct(@Body() newProductImages) {
    return this.productImagesService.createProductImages(newProductImages);
  }
}
