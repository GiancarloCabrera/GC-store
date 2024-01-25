import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import ProductImages from '../products-images/products-images.entity';
import Keyword from 'src/keywords/keywords.entity';
import Opinion from 'src/opinions/opinions.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImagesService } from '../products-images/products-images.service';
import { S3Service } from 'src/S3/s3.service';
import { KeywordService } from 'src/keywords/keywords.service';

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
    private S3Service: S3Service,
    private keywordService: KeywordService
  ) { }

  async createProduct(product: CreateProductDto, files: any) {
    try {
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
        for (let img of product_found.images) {
          // Using another try-catch to catch errors inside the for loop
          try {
            const p_img = await this.productImageService.deleteProductImage(img.id)
            console.log('P_img ', p_img);
            if (p_img.$metadata?.httpStatusCode === 404) return p_img;
            // img = p_img;
          } catch (error) {
            throw error;
          }
        }
      }

      console.log('PRODUCT FOUND: ', product_found);

      // if (product.opinions) {
      //   product.opinions.forEach(async (op) => await this.opinionRepository.remove(op));
      // }

      // ONCE THE PRODUCT IS REMOVED, WILL BE REMOVED FROM THE RELATION product_keywords automatically
      return await this.productRepository.remove(product_found);
    } catch (error) {
      console.log('ENTRO ER: ', error);

      throw error;
    }
  }

  async updateProduct(product: UpdateProductDto, files: any) {
    try {
      const product_found = await this.findProductById(product.id);

      // Images --> Manipulate the relation & table
      if (files) {
        // If there are images to delete
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

        // Updating new group of images
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
      // if (product.opinions) {

      // }
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
