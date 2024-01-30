import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateOpinionDto } from 'src/opinions/dto/create-opinion';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsString()
  genre: string;

  @IsString()
  material: string;

  @IsString()
  care_instruc: string;

  @IsNumber()
  model_num: number;

  @IsNumber()
  serie: number;

  @IsBoolean()
  on_stock: boolean;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  shipment_details: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsArray()
  @IsOptional()
  // @Type(() => CreateOpinionDto)
  opinions?: OpinionDto[];

  @IsString()
  status: string;
}

class OpinionDto {
  text: string;
  userId: number;
}