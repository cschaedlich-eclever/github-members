import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LanguageDto } from './language.dto';

export class EmployeeDto {
  @IsString()
  login: string;
  @IsString()
  @IsOptional()
  name: string | null;
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  languages: LanguageDto[];
}
