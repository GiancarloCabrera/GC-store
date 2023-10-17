import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOpinionDto } from './dto/create-opinion';
import { InjectRepository } from '@nestjs/typeorm';
import Opinion from './opinions.entity';
import { Repository } from 'typeorm';
import Product from 'src/products/products.entity';
import User from 'src/users/user.entity';

@Injectable()
export class OpinionsService {
  constructor(
    @InjectRepository(Opinion)
    private opinionRepository: Repository<Opinion>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createOpinion(opinion: CreateOpinionDto) {
    try {

      // Search actual product
      const find_product = await this.productRepository.findOne({
        where: {
          id: opinion.productId
        }
      });

      if (!find_product) throw new BadRequestException('Product not found...');

      // Search user
      const find_user = await this.userRepository.findOne({
        where: {
          id: opinion.userId
        }
      });


      if (!find_user) throw new BadRequestException('User not found...');

      let save_op = new Opinion();
      save_op.text = opinion.text;
      save_op.product = find_product;
      save_op.user = find_user;

      return this.opinionRepository.save(save_op);
    } catch (error) {
      throw error;
    }
  }

  async deleteOpinion(id: number) {
    try {
      return this.opinionRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
