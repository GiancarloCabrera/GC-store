import { Module } from '@nestjs/common';
import { OpinionsController } from './opinions.controller';

@Module({
  controllers: [OpinionsController]
})
export class OpinionsModule {}
