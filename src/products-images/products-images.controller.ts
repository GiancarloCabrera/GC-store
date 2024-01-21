import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UploadedFile } from '@nestjs/common';
import { ProductImagesService } from './products-images.service';
import { CreateProductImageDto } from './dto/create-product-images';

@Controller('products-images')
export class ProductsImagesController {
  constructor(private productImagesService: ProductImagesService) { }

  @Post()
  async createProductImage(@UploadedFile() ProdFile: CreateProductImageDto) {
    console.log('paso ', ProdFile);

    // return this.productImagesService.createProductImage(ProdFile);
  }

  @Put()
  updateProductImage(@Body() newProductImages) {
    return this.productImagesService.updateProductImage(newProductImages);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.deleteProductImage(id);
  }
}
