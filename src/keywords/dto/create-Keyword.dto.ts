import { IsString } from "class-validator";

export class CreateKeywordDto {
  @IsString()
  keyword: string
}
