import { IsNumber, IsString, IsNotEmpty, Validate } from "class-validator"
import { FileUploadValidator } from "src/validators/file-upload.validator";

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsString()
  file_name: string;

  @IsNotEmpty()
  // Personalized Validator
  @Validate(FileUploadValidator, { message: 'Invalid file upload' })
  file: Buffer;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
