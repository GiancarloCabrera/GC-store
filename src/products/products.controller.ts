import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  createProduct(@Body() newProduct: CreateProductDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log('from controller', newProduct);
    console.log('from controller opinions', typeof newProduct.opinions);
    console.log('from controller files', files);

    return this.productsService.createProduct(newProduct, files);
  }

  @Put()
  @UseInterceptors(FilesInterceptor('files'))

  updateProduct(@Body() updProduct: UpdateProductDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.productsService.updateProduct(updProduct, files);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Get(':id')
  findProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findProductById(id);
  }

  @Get()
  getAllProducts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.productsService.getAllProducts(page, limit);
  }
}
