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
  ) {}

  // async createKeyword({ keywords }: CreateKeywordDto) {
  //   try {
  //     const keywords_list = [];
  //     for (const keywordStr of keywords) {
  //       let keyword = await this.keywordRepository.findOne({
  //         where: {
  //           keyword: keywordStr
  //         }
  //       });
  //       if (!keyword) {
  //         // Empty keyword entity
  //         keyword = new Keyword();
  //         keyword.keyword = keywordStr;
  //         // Saving keyword to the database
  //         keyword = await this.keywordRepository.save(keyword);
  //       }
  //       // Adding the created entities to the array
  //       keywords_list.push(keyword);
  //     }
  //     return keywords_list;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async createKeyword(keyword: CreateKeywordDto) {
    try {
      const k_wd = keyword.keyword.toLowerCase();
      const found_keyword = await this.keywordRepository.findOne({
        where: {
          keyword: k_wd,
        },
      });

      if (found_keyword)
        throw new BadRequestException(`Keyword already exists...`);

      const new_keyword = new Keyword();
      new_keyword.keyword = k_wd;

      return await this.keywordRepository.save(new_keyword);
    } catch (error) {
      throw error;
    }
  }

  async deleteKeyword(id: number) {
    try {
      const found_keyword = await this.findKeywordById(id);
      if (!found_keyword) throw new BadRequestException(`Keyword not found...`);
      return await this.keywordRepository.remove(found_keyword);
    } catch (error) {
      throw error;
    }
  }

  async updateKeyword(keyword: UpdateKeywordDto) {
    try {
      const k_wd = keyword.keyword.toLowerCase();
      const found_keyword = await this.findKeywordById(keyword.id);
      if (!found_keyword) throw new BadRequestException(`Keyword not found...`);
      found_keyword.keyword = k_wd;

      return await this.keywordRepository.save(found_keyword);
    } catch (error) {
      throw error;
    }
  }

  async findKeywordById(id: number) {
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
