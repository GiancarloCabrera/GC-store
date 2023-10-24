import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateProductImageDto {
  @IsNumber()
  id: number;

  @IsString()
  path: string;

  @IsNumber()
  @IsOptional()
  productId?: number;
}
