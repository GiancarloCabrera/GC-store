import { IsNumber, IsString } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  path: string;

  @IsNumber()
  productId: number;
}
