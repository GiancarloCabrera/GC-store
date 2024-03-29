import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { CreateOpinionDto } from './dto/create-opinion';
import { UpdateOpinionDto } from './dto/update-opinion';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiSecurity('Api-Key')
@ApiTags('Opinions')
@Controller('opinions')
export class OpinionsController {
  constructor(private opinionsService: OpinionsService) { }

  @Post()
  createOpinion(@Body() newOpinion: CreateOpinionDto) {
    return this.opinionsService.createOpinion(newOpinion);
  }

  @Put()
  updateOpinion(@Body() updOpinion: UpdateOpinionDto) {
    return this.opinionsService.updateOpinion(updOpinion);
  }

  @Delete(':id')
  deleteOpinion(@Param('id', ParseIntPipe) id: number) {
    return this.opinionsService.deleteOpinion(id);
  }

  @Get('/user/:id')
  getOpinionsByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.opinionsService.getOpinionsByUserId(id);
  }

  @Get('/product/:id')
  getOpinionsByProductId(@Param('id', ParseIntPipe) id: number) {
    return this.opinionsService.getOpinionsByProductId(id);
  }
}
