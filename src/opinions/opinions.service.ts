import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOpinionDto } from './dto/create-opinion';
import { InjectRepository } from '@nestjs/typeorm';
import Opinion from './opinions.entity';
import { Repository } from 'typeorm';
import Product from 'src/products/products.entity';
import User from 'src/users/user.entity';
import { UpdateOpinionDto } from './dto/update-opinion';

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
          id: opinion.productId,
        },
      });

      if (!find_product) throw new BadRequestException('Product not found...');

      // Search user
      const find_user = await this.userRepository.findOne({
        where: {
          id: opinion.userId,
        },
      });

      if (!find_user) throw new BadRequestException('User not found...');

      const save_op = new Opinion();
      save_op.text = opinion.text;
      save_op.product = find_product;
      save_op.user = find_user;
      console.log('sav_op: ', save_op);

      return await this.opinionRepository.save(save_op);
    } catch (error) {
      throw error;
    }
  }

  async updateOpinion(updOpinion: UpdateOpinionDto) {
    const op = await this.opinionRepository.findOne({
      where: {
        id: updOpinion.id
      },
    });

    if (!op) throw new BadRequestException('Opinion not found...');

    op.text = updOpinion.text;

    return await this.opinionRepository.save(op)
  }

  async deleteOpinion(id: number) {
    try {
      const op = await this.opinionRepository.findOne({
        where: {
          id
        },
      });

      if (!op) throw new BadRequestException('Opinion not found...');

      return await this.opinionRepository.remove(op);
    } catch (error) {
      throw error;
    }
  }

  async getOpinionsByUserId(id: number) {
    const op = await this.opinionRepository.find({
      where: {
        user: { id }
      }
    });

    if (!op.length) {
      return {
        msg: 'No opinions found...',
        opinions: op
      }
    }
    return {
      msg: 'Opinions found...',
      opinions: op
    }
  }

  async getOpinionsByProductId(id: number) {
    const op = await this.opinionRepository.find({
      where: {
        product: { id }
      }
    });

    if (!op.length) {
      return {
        msg: 'No opinions found...',
        opinions: op
      }
    }
    return {
      msg: 'Opinions found...',
      opinions: op
    }
  }
}
