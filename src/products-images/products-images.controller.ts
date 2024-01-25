import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductImagesService } from './products-images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products-images')
export class ProductsImagesController {
  constructor(private productImagesService: ProductImagesService) { }

  @Post(':product_id')
  @UseInterceptors(FileInterceptor('file'))
  createProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('product_id', ParseIntPipe) product_id: number,
  ) {
    console.log(file, product_id);

    return this.productImagesService.createProductImage(file, product_id);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.deleteProductImage(id);
  }
}
