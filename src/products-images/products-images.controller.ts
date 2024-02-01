import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductImagesService } from './products-images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiSecurity('Api-Key')
@ApiTags('Product Images')
@Controller('product-image')
export class ProductsImagesController {
  constructor(private productImagesService: ProductImagesService) { }

  @Post(':product_id')
  @UseInterceptors(FileInterceptor('file'))
  createProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('product_id', ParseIntPipe) product_id: number,
  ) {
    return this.productImagesService.createProductImage(file, product_id);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.deleteProductImage(id);
  }

  @Get(':id')
  getProductImageById(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.getProductImageById(id);
  }

  @Get('')
  getAllProductImages(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.productImagesService.getAllProductImages(page, limit);
  }

  @Get('/product/:id')
  getProductImagesByProductId(@Param('id', ParseIntPipe) id: number) {
    return this.productImagesService.getProductImagesByProductId(id);
  }
}
