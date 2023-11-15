import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeDto } from './employee.dto';

export class EmployeeResultDto {
  @ValidateNested({ each: true })
  @Type(() => EmployeeDto)
  data: EmployeeDto[];
  @IsNumber()
  total: number;
}
