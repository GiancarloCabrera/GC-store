import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './auth/apiKeyAuth/apikey.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @UseGuards(ApiKeyGuard)s
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
