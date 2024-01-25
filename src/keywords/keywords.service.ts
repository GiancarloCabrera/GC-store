import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Keyword from './keywords.entity';
import { CreateKeywordDto } from './dto/create-Keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
  ) { }

  // async createKeyword(keyword: CreateKeywordDto) {
  async createKeyword(keyword: string) {
    try {
      const k_wd = keyword.toLowerCase();
      const found_keyword = await this.keywordRepository.findOne({
        where: {
          keyword: k_wd,
        },
      });

      if (!found_keyword) {
        const new_keyword = new Keyword();
        new_keyword.keyword = k_wd;

        return await this.keywordRepository.save(new_keyword);
      }
      return found_keyword;
    } catch (error) {
      throw error;
    }
  }


  async updateKeyword(keyword: UpdateKeywordDto) {
    try {
      const k_wd = keyword.keyword.toLowerCase();
      const found_keyword = await this.getKeywordById(keyword.id);
      if (!found_keyword) throw new BadRequestException(`Keyword not found...`);
      found_keyword.keyword = k_wd;

      return await this.keywordRepository.save(found_keyword);
    } catch (error) {
      throw error;
    }
  }

  async deleteKeyword(id: number) {
    try {
      const found_keyword = await this.getKeywordById(id);
      if (!found_keyword) throw new BadRequestException(`Keyword not found...`);
      return await this.keywordRepository.remove(found_keyword);
    } catch (error) {
      throw error;
    }
  }

  async getKeywordById(id: number) {
    try {
      const found_keyword = this.keywordRepository.findOne({
        where: {
          id,
        },
      });
      if (!found_keyword) throw new BadRequestException(`Keyword not found...`);
      return found_keyword;
    } catch (error) {
      throw error;
    }
  }

  async getAllKeywords(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const [keywords, total] = await this.keywordRepository.findAndCount({
        skip,
        take: limit,
      });
      const total_pages = Math.ceil(total / limit);
      const has_next_page = page < total_pages;

      return {
        keywords,
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
