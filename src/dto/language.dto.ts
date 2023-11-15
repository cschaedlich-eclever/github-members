import { IsNumber, IsString } from 'class-validator';

export class LanguageDto {
  @IsString()
  name: string;
  @IsNumber()
  count: number;
  @IsNumber()
  loc: number;
}
