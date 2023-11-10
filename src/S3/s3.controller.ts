import { Controller, Get, Param, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({ maxSize: 1000 }),
        // new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })
  ) file: Express.Multer.File) {
    return await this.s3Service.uploadS3(file.originalname, file.buffer)
  }

  // Pending to check if its worthy to use this endpoint
  @Get('download')
  async getImage(@Query('file') file: string) {
    console.log(file);

    return await this.s3Service.getS3(file);
  }
}
