import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Post()
  createProduct(@Body() newProduct: CreateProductDto) {
    console.log("from controller", newProduct);

    return this.productsService.createProduct(newProduct);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
