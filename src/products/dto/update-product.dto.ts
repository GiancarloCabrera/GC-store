import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

export class UpdateProductDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsString()
  @IsOptional()
  care_instruc?: string;

  @IsNumber()
  @IsOptional()
  model_num?: number;

  @IsNumber()
  @IsOptional()
  serie?: number;

  @IsBoolean()
  @IsOptional()
  on_stock?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => image)
  images?: image[];

  @IsString()
  @IsOptional()
  shipment_details?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  opinions?: string[];

  @IsString()
  @IsOptional()
  status?: string;
}

class image {
  @IsNumber()
  id: number;

  @IsString()
  path: string;
}
