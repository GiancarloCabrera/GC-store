import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateKeywordDto } from './dto/create-Keyword.dto';
import { KeywordService } from './keywords.service';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Controller('keywords')
export class KeywordsController {
  constructor(private keywordsService: KeywordService) { }

  @Post()
  createKeyword(@Body() newKeyword: CreateKeywordDto) {
    return this.keywordsService.createKeyword(newKeyword);
  }

  @Put()
  updateKeyword(@Body() updKeyword: UpdateKeywordDto) {
    return this.keywordsService.updateKeyword(updKeyword);
  }

  @Delete(':id')
  deleteKeyword(@Param('id', ParseIntPipe) id: number) {
    return this.keywordsService.deleteKeyword(id);
  }

}
