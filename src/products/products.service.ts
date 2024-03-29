import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import ProductImages from '../products-images/products-images.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImagesService } from '../products-images/products-images.service';
import { S3Service } from 'src/S3/s3.service';
import { KeywordService } from 'src/keywords/keywords.service';
import { OpinionsService } from 'src/opinions/opinions.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private productImageRepository: Repository<ProductImages>,
    private productImageService: ProductImagesService,
    private S3Service: S3Service,
    private keywordService: KeywordService,
    private opinionsService: OpinionsService
  ) { }

  async createProduct(product: CreateProductDto, files: any) {
    try {
      if (files) {
        const p_images = [];
        for (const file of files) {
          let s3 = await this.S3Service.uploadS3(file.originalname.trim(), file.buffer);
          if (s3.file.httpStatusCode !== 200) throw new BadRequestException('Image could not be saved...');

          let p_img = new ProductImages();
          p_img.path = s3.file.url;
          p_img = await this.productImageRepository.save(p_img);
          p_images.push(p_img);
        }

        if (!p_images) throw new BadRequestException('Product Images could not be saved...');

        // Association
        // Product ---> group of its images
        product.images = p_images;
      }

      if (product.keywords) {
        const keywords_list = [];
        for (const keyStr of product.keywords) {
          const keyword = await this.keywordService.createKeyword(keyStr);
          if (!keyword) throw new BadRequestException(`${keyStr} could not be saved`);
          keywords_list.push(keyword);
        }

        if (!keywords_list) throw new BadRequestException('Product Keywords could not be saved...');

        // Association
        // Product ---> group of its keywords
        product.keywords = keywords_list;
      }

      const new_product = new Product();
      Object.assign(new_product, product);
      const saved_product = await this.productRepository.save(new_product);

      if (product.opinions) {
        for (const op of product.opinions) {
          const new_opinion = {
            text: op.text,
            productId: saved_product.id,
            userId: op.userId
          }
          let created_op = await this.opinionsService.createOpinion(new_opinion);
          console.log(created_op);
        }
      }

      return saved_product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      const product_found = await this.findProductById(id);

      if (product_found.images) {
        for (let img of product_found.images) {
          // Using another try-catch to catch errors inside the for loop
          try {
            const p_img = await this.productImageService.deleteProductImage(img.id)
            if (p_img.$metadata?.httpStatusCode === 404) return p_img;
          } catch (error) {
            throw error;
          }
        }
      }

      if (product_found.opinions) {
        product_found.opinions.forEach(async (op) => await this.opinionsService.deleteOpinion(op.id));
      }

      // ONCE THE PRODUCT IS REMOVED, WILL BE REMOVED FROM THE RELATION product_keywords automatically
      return await this.productRepository.remove(product_found);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product: UpdateProductDto, files: any) {
    try {
      const product_found = await this.findProductById(product.id);

      // Images --> Manipulate the relation & table
      if (files) {
        if (product_found.images) {
          for (let img of product_found.images) {
            // Using another try-catch to catch errors inside the for loop
            try {
              const p_img = await this.productImageService.deleteProductImage(img.id)
              console.log('P_img ', p_img);
              if (p_img.$metadata?.httpStatusCode === 404) return p_img;
            } catch (error) {
              throw error;
            }
          }
        }

        const p_images = [];
        for (const file of files) {
          let s3 = await this.S3Service.uploadS3(file.originalname.trim(), file.buffer);
          if (s3.file.httpStatusCode !== 200) throw new BadRequestException('Image could not be saved...');

          let p_img = new ProductImages();
          p_img.path = s3.file.url;
          p_img = await this.productImageRepository.save(p_img);
          p_images.push(p_img);
        }

        if (!p_images) throw new BadRequestException('Product Images could not be saved...');
        product_found.images = p_images;
      }

      // Keywords --> Manipulate only the relation
      if (product.keywords) {
        const upd_keywords = [];
        // Create new keyword
        for (const kwd of product.keywords) {
          const low = kwd.toLowerCase();
          const new_kwd = await this.keywordService.createKeyword(low);
          upd_keywords.push(new_kwd);
        }

        // Break actual relation
        product.keywords = upd_keywords;
      }

      // Opinions
      if (product.opinions) {
        // Delete actual ones
        if (product_found.opinions) {
          product_found.opinions.forEach(async (op) => await this.opinionsService.deleteOpinion(op.id));
        }
        // Create new ones
        const new_op = []
        for (const op of product.opinions) {
          const new_opinion = {
            text: op.text,
            productId: product_found.id,
            userId: op.userId
          }
          let created_op = await this.opinionsService.createOpinion(new_opinion);
          new_op.push(created_op)
        }
        product.opinions = new_op;
      }

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
          opinions: true,
        },
        where: {
          id,
        },
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
        take: limit,
      });

      const total_pages = Math.ceil(total / limit);
      const has_next_page = page < total_pages;

      return {
        products,
        total,
        page,
        total_pages,
        has_next_page,
      };
    } catch (error) {
      throw error;
    }
  }
}
