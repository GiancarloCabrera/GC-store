import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Product from "./products.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

  async createProduct(product: Product) {
    return this.productRepository.create(product);
  }
}