import { Injectable, OnModuleInit } from '@nestjs/common';
import { ImportService } from './import.service';
import { Repository } from '../database/repository/repository';
import { EmployeeDto } from '../dto/employee.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmployeeResultDto } from '../dto/employee-result.dto';

@Injectable()
export class EmployeeService implements OnModuleInit {
  constructor(
    private readonly importService: ImportService,
    private readonly repository: Repository
  ) {}

  private async importEmployees(): Promise<void> {
    const employees = await this.importService.fetchEmployees();
    await this.repository.import(employees);
  }

  async onModuleInit(): Promise<void> {
    if (!(await this.repository.entriesExist())) {
      await this.importEmployees();
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron(): Promise<void> {
    await this.importEmployees();
  }

  public async getEmployeeWithLanguageRanks(
    language?: string
  ): Promise<EmployeeResultDto> {
    const results =
      await this.repository.getEmployeesWithLanguageRanks(language);

    const data = Array.from(
      results
        .reduce((prev, curr) => {
          const employee = prev.get(curr.id) ?? {
            name: curr.name,
            login: curr.login,
            languages: []
          };
          prev.set(curr.id, employee);
          employee.languages.push({
            name: curr.language,
            loc: curr.loc,
            count: curr.count
          });
          return prev;
        }, new Map<number, EmployeeDto>())
        .values()
    );

    return { data, total: data.length };
  }
}
