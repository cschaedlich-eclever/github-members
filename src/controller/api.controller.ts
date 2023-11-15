import { Controller, Get, Query } from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { ApiQuery } from '@nestjs/swagger';
import { EmployeeResultDto } from '../dto/employee-result.dto';

@Controller('/api')
export class ApiController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiQuery({
    name: 'language',
    type: String,
    required: false
  })
  @Get('/employees')
  async getEmployeesWithRanks(
    @Query('language') language?: string
  ): Promise<EmployeeResultDto> {
    return this.employeeService.getEmployeeWithLanguageRanks(language);
  }
}
