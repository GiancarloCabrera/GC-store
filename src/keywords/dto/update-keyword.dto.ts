import { IsNumber, IsString } from 'class-validator';

export class UpdateKeywordDto {
  @IsNumber()
  id: number;
  @IsString()
  keyword: string;
}
