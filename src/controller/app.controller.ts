import { Controller, Get, Query, Render } from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(['', '/search'])
  @Render('index')
  async root(@Query('language') language?: string) {
    const result = await this.employeeService.getEmployeeWithLanguageRanks(
      language || undefined
    );
    return { ...result, language };
  }
}
