import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Product from "./products.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import ProductImages from "../products-images/products-images.entity";
import Keyword from "src/keywords/keywords.entity";
import Opinion from "src/opinions/opinions.entity";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductImagesService } from '../products-images/products-images.service';
import { KeywordService } from "src/keywords/keywords.service";

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
    private productImageService: ProductImagesService,
    // private keywordService: KeywordService
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
          keywords: true,
          images: true,
          opinions: true
        },
        where: {
          id: product.id
        }
      });

      if (!product_found) throw new BadRequestException('Product not found...');

      const actual_images = product_found.images;
      const actual_keywords = product_found.keywords;
      const actual_opinions = product_found.opinions;
      Object.assign(product_found, product);

      // Images
      // Update only the image thye sent me
      // if (product.images) {
      // for (const img of product.images) {
      //   const found_img = await this.productImagesRepository.findOne({
      //     relations: {
      //       product: true
      //     },
      //     where: {
      //       id: img.id,
      //     }
      //   });

      //   if (!found_img) throw new BadRequestException('Image not found...');
      //   if (found_img.product.id !== product.id) throw new BadRequestException(`Image with id ${found_img.id} is not related to this product...`);
      //   Object.assign(found_img, img);

      //   const new_img = await this.productImageRepository.save(found_img);
      //   actual_images.map(img => img.id === new_img.id ? new_img : img);
      // }
      // product_found.images = actual_images;
      // }

      if (product.images) {
        const found_product_img = [];
        for (const img of product.images) {
          // Update
          const found_img = await this.productImageService.updateProductImage({
            id: img.id,
            path: img.path,
            productId: product.id
          });
          found_product_img.push(found_img);
        }

        const imgs_to_delete = actual_images.filter(img_a => {
          return !found_product_img.some(img_b => img_a.id === img_b.id);
        });

        // Delete
        imgs_to_delete.forEach(img => this.productImageService.deleteProductImage(img.id));
        // Make the relation
        product_found.images = found_product_img;
      }

      // Keywords
      if (product.keywords) {
        const upd_keywords = []
        for (const keyStr of product.keywords) {
          let found_keyword = await this.keywordRepository.findOne({
            where: {
              id: keyStr.id
            }
          });

          if (!found_keyword) throw new BadRequestException(`Keyword ${keyStr.id} not found...`);
          upd_keywords.push(found_keyword);
        }
        product_found.keywords = upd_keywords;
      }
      console.log(product_found);

      return await this.productRepository.save(product_found);
    } catch (error) {
      throw error;
    }
  }
}