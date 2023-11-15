import { Inject, Injectable } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { PartialModelGraph, Transaction } from 'objection';
import { ProjectModel } from '../models/project.model';
import { LanguageModel } from '../models/language.model';
import { EmployeeCountModel } from '../models/extended/employee.count.model';
import { EmployeeGroupResultModel } from '../models/extended/employee-group-result.model';

@Injectable()
export class Repository {
  constructor(
    @Inject(EmployeeModel) private readonly employeeModel: typeof EmployeeModel,
    @Inject(ProjectModel) private readonly projectModel: typeof ProjectModel,
    @Inject(LanguageModel) private readonly languageModel: typeof LanguageModel,
    @Inject(EmployeeCountModel)
    private readonly employeeCountModel: typeof EmployeeCountModel,
    @Inject(EmployeeGroupResultModel)
    private readonly employeeGroupResultModel: typeof EmployeeGroupResultModel
  ) {}

  public async getEmployeesWithLanguageRanks(
    language?: string
  ): Promise<EmployeeGroupResultModel[]> {
    return this.employeeGroupResultModel
      .query()
      .select([
        'employees.id as id',
        'employees.name as name',
        'employees.login as login',
        'projects:languages.name as language'
      ])
      .sum('loc as loc')
      .count('* as count')
      .joinRelated('projects.languages')
      .groupBy(
        'employees.id',
        'employees.name',
        'employees.login',
        'projects:languages.name'
      )
      .orderBy([
        { column: 'count', order: 'DESC' },
        { column: 'loc', order: 'DESC' }
      ])
      .modify((qb) => {
        if (language !== undefined) {
          qb.whereILike('projects:languages.name', language);
        }
      });
  }

  async entriesExist(): Promise<boolean> {
    const [result] = await this.employeeCountModel.query().count();
    return result.count > 0;
  }

  async deleteAll(trx: Transaction): Promise<void> {
    await this.employeeModel.query(trx).delete();
    await this.projectModel.query(trx).delete();
    await this.languageModel.query(trx).delete();
  }

  async import(employees: PartialModelGraph<EmployeeModel>[]): Promise<void> {
    await this.employeeModel.transaction(async (trx) => {
      await this.deleteAll(trx);
      await this.employeeModel
        .query(trx)
        .insertGraph(employees, { allowRefs: true });
    });
  }
}
