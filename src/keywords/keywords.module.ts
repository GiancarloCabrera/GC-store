import { Module } from '@nestjs/common';
import { KeywordsController } from './keywords.controller';
import { KeywordService } from './keywords.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Keyword from './keywords.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [KeywordsController],
  providers: [KeywordService]

})
export class KeywordsModule { }
