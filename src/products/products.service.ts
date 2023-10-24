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
        const k_wd = keyStr.toLowerCase();

        let keyword = await this.keywordRepository.findOne({
          where: {
            keyword: k_wd
          }
        });

        if (!keyword) {
          keyword = new Keyword();
          keyword.keyword = k_wd;
          keyword = await this.keywordRepository.save(keyword);
        }

        keywords_list.push(keyword);
      }

      if (!keywords_list) throw new BadRequestException('Product Keywords could not be saved...');

      // Association
      // Product ---> group of its keywords
      product.keywords = keywords_list;

      // if (product.opinions) {
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
      const product_found = await this.findProductById(id);

      if (!product_found) throw new BadRequestException('Product not found...');
      console.log(product_found);
      if (product_found.images) {
        product_found.images.forEach(async (img) => await this.productImageRepository.remove(img));
      }

      // if (product.opinions) {
      //   product.opinions.forEach(async (op) => await this.opinionRepository.remove(op));
      // }

      // ONCE THE PRODUCT IS REMOVED, WILL BE REMOVED FROM THE RELATION product_keywords automatically
      return await this.productRepository.remove(product_found);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product: UpdateProductDto) {
    try {
      const product_found = await this.findProductById(product.id);

      if (!product_found) throw new BadRequestException('Product not found...');

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

      // Images --> Manipulate the relation & table
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

        const imgs_to_delete = product_found.images.filter(img_a => {
          return !found_product_img.some(img_b => img_a.id === img_b.id);
        });

        // Delete
        imgs_to_delete.forEach(img => this.productImageService.deleteProductImage(img.id));
        // Make the relation
        product.images = found_product_img;
      }

      // Keywords --> Manipulate only the relation
      if (product.keywords) {
        const upd_keywords = []
        for (const keyStr of product.keywords) {
          const k_wd = keyStr.toLowerCase();
          let found_keyword = await this.keywordRepository.findOne({
            where: {
              keyword: k_wd
            }
          });

          if (!found_keyword) throw new BadRequestException(`Keyword ${k_wd} not found...`);
          upd_keywords.push(found_keyword);
        }
        product.keywords = upd_keywords;
      }

      // Opinions
      // if (product.opinions) {

      // }
      console.log(product_found);
      Object.assign(product_found, product);

      return await this.productRepository.save(product_found);
    } catch (error) {
      throw error;
    }
  }

  async findProductById(id: number) {
    try {
      const product_found = await this.productRepository.findOne({
        relations: {
          images: true,
          keywords: true,
          opinions: true
        },
        where: {
          id
        }
      });

      if (!product_found) throw new BadRequestException('Product not found...');
      return product_found;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      console.log(skip);

      const [products, total] = await this.productRepository.findAndCount({
        // Where should we start
        skip,
        // How many
        take: limit
      });

      const total_pages = Math.ceil(total / limit);
      const has_next_page = page < total_pages;

      return {
        products,
        total,
        page,
        total_pages,
        has_next_page
      }
    } catch (error) {
      throw error;
    }
  }
}