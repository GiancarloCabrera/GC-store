import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' })
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.s3Service.uploadS3(file.originalname, file.buffer);
  }

  // Pending to check if its worthy to use this endpoint
  @Get('download')
  async getFile(@Query('file') file: string) {
    console.log(file);

    return await this.s3Service.getS3(file);
  }
  // TODO: SET PARAMS, NOT ONLT / ON THE ENDPOINT

  @Delete(':file_name')
  async deleteFile(@Param('file_name') file_name: string) {
    return await this.s3Service.deleteS3(file_name);
  }
}
