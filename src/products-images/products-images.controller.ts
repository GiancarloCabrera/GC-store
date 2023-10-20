import { Body, Controller, Post, Put } from '@nestjs/common';
import { ProductImagesService } from './products-images.service';

@Controller('products-images')
export class ProductsImagesController {
  constructor(private productImagesService: ProductImagesService) { }

  @Post()
  createProductImage(@Body() newProductImages) {
    return this.productImagesService.createProductImage(newProductImages);
  }

  @Put()
  updateProductImage(@Body() newProductImages) {
    return this.productImagesService.updateProductImage(newProductImages);
  }
}
