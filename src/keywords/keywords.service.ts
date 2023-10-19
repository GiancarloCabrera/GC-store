import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Keyword from "./keywords.entity";
import { CreateKeywordDto } from "./dto/create-Keyword.dto";

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
  ) { }

  async createKeyword({ keywords }: CreateKeywordDto) {
    try {
      const keywords_list = [];
      for (const keywordStr of keywords) {
        let keyword = await this.keywordRepository.findOne({
          where: {
            keyword: keywordStr
          }
        });
        if (!keyword) {
          // Empty keyword entity
          keyword = new Keyword();
          keyword.keyword = keywordStr;
          // Saving keyword to the database
          keyword = await this.keywordRepository.save(keyword);
        }
        // Adding the created entities to the array
        keywords_list.push(keyword);
      }
      return keywords_list;
    } catch (error) {
      throw error;
    }
  }

  async deleteKeyword(keyword: string) {
    try {
      const keyw = await this.keywordRepository.findOne({
        where: {
          keyword
        }
      });

      return await this.keywordRepository.remove(keyw)
    } catch (error) {
      throw error;
    }
  }
}