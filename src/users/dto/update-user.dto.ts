import { IsOptional, IsString } from 'class-validator';

export class UpdateUSerDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
