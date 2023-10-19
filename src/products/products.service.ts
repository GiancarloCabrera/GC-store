import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Product from "./products.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import ProductImages from "../products-images/products-images.entity";
import Keyword from "src/keywords/keywords.entity";
import Opinion from "src/opinions/opinions.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private productImageRepository: Repository<ProductImages>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(Opinion)
    private opinionRepository: Repository<Opinion>,
  ) { }

  async createProduct(product: CreateProductDto) {
    try {
      const p_images = [];
      for (const img of product.images) {
        let p_img = new ProductImages();
        p_img.path = img;
        p_img = await this.productImageRepository.save(p_img);
        p_images.push(p_img);
      }

      if (!p_images) throw new BadRequestException('Product Images could not be saved...');

      // Association
      // Product ---> group of its images
      product.images = p_images;

      const keywords_list = [];
      for (const keyStr of product.keywords) {
        let keyword = await this.keywordRepository.findOne({
          where: {
            keyword: keyStr
          }
        });

        if (!keyword) {
          keyword = new Keyword();
          keyword.keyword = keyStr;
          keyword = await this.keywordRepository.save(keyword);
        }

        keywords_list.push(keyword);
      }

      if (!keywords_list) throw new BadRequestException('Product Keywords could not be saved...');

      // Association
      // Product ---> group of its keywords
      product.keywords = keywords_list;

      // if (product.opinions) {
      //   const opinions_list = []
      //   for (const opinion of product.opinions) {
      //     console.log(opinion);

      //     let new_op = new Opinion();
      //     new_op.text = opinion;
      //     new_op = await this.opinionRepository.save(new_op);
      //     opinions_list.push(new_op)
      //   }
      //   new_product.opinions = opinions_list;
      // }

      const new_product = new Product();
      Object.assign(new_product, product);

      return await this.productRepository.save(new_product);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      // Find the product
      const product = await this.productRepository.findOne({
        relations: {
          images: true,
          keywords: true,
          opinions: true
        },
        where: {
          id
        }
      });

      if (!product) throw new BadRequestException('Product not found...');

      // Delete product Images -- THIS SHOULD BE ON THE SERVICE
      product.images.forEach(async (img) => await this.productImageRepository.remove(img));

      if (product.opinions) {
        product.opinions.forEach(async (op) => await this.opinionRepository.remove(op));
      }

      // Delete keyword
      // product.keywords.forEach((keyword) => {
      //   keyword.products = keyword.products.filter((p) => p.id !== productId);
      // });

      // ONCE THE PRODUCT IS REMOVED, WILL BE REMOVED FROM THE RELATION product_keywords automatically
      return await this.productRepository.remove(product)
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product: UpdateProductDto) {
    try {
      const product_found = await this.productRepository.findOne({
        relations: {
          opinions: true
        },
        where: {
          id: product.id
        }
      });

      if (!product_found) throw new BadRequestException('Product not found...');
      Object.assign(product_found, product)
      console.log(product_found);

      // PENDING TO ADD UPDATED PRODUCT
    } catch (error) {
      throw error;
    }
  }
}