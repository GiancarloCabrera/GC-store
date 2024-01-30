import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

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

  @IsString()
  @IsOptional()
  shipment_details?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsArray()
  @IsOptional()
  opinions?: OpinionDto[];

  @IsString()
  @IsOptional()
  status?: string;
}

class OpinionDto {
  text: string;
  userId: number;
}