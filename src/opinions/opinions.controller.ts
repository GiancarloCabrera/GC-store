import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { CreateOpinionDto } from './dto/create-opinion';
import { UpdateOpinionDto } from './dto/update-opinion';

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

  // TODO: Get opinions by user id and by product it
}
