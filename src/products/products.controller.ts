import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Post()
  createProduct(@Body() newProduct: CreateProductDto) {
    console.log("from controller", newProduct);

    return this.productsService.createProduct(newProduct);
  }

  @Put()
  updateProduct(@Body() updProduct: UpdateProductDto) {
    return this.productsService.updateProduct(updProduct);
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
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.productsService.getAllProducts(page, limit);
  }
}
