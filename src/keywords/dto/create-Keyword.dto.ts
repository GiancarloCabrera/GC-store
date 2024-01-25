import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateKeywordDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;

  @IsNotEmpty()
  @IsNumber()
  productId: string;
}
