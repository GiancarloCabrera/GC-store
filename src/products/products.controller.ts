import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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
}
