import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  care_instruc?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  model_num?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  serie?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  on_stock?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shipment_details?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  opinions?: OpinionDto[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;
}

class OpinionDto {
  text: string;
  userId: number;
}