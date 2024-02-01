import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  care_instruc: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  model_num: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  serie: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  on_stock: boolean;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shipment_details: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  opinions?: OpinionDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}

class OpinionDto {
  text: string;
  userId: number;
}