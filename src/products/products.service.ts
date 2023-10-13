import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Product from "./products.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import ProductImages from "../products-images/products-images.entity";
import { KeywordsService } from "src/keywords/keywords.service";
import { ProductImagesService } from "src/products-images/products-images.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private productImageRepository: Repository<ProductImages>,
    private keywordsService: KeywordsService,
    private productImagesService: ProductImagesService
  ) { }

  // MISSING TYPE
  async createProduct(product: CreateProductDto) {
    const new_product = new Product();
    new_product.name = product.name
    new_product.description = product.description
    new_product.size = product.size
    new_product.color = product.color
    new_product.price = product.price
    new_product.category = product.category
    new_product.genre = product.genre
    new_product.material = product.material
    new_product.care_instruc = product.care_instruc
    new_product.model_num = product.model_num
    new_product.serie = product.serie
    new_product.on_stock = product.on_stock
    // Association
    // Product ---> group of its images
    new_product.images = await this.productImagesService.createProductImages({ images: product.images });
    new_product.shipment_details = product.shipment_details
    // Association
    // Product ---> group of its keywords
    new_product.keywords = await this.keywordsService.createKeyword({ keywords: product.keywords });
    new_product.status = product.status


    console.log("Final Product: ", new_product);
    return this.productRepository.save(new_product);
  }
}