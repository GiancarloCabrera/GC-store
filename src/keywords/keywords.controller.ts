import { Body, Controller, Post } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-Keyword.dto';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private keywordsService: KeywordsService) { }

  @Post()
  createProduct(@Body() newKeywords: CreateKeywordDto) {
    return this.keywordsService.createKeyword(newKeywords);
  }
}
