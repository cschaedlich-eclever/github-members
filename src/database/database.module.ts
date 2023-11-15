import { Module } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import * as knex from 'knex';
import { ConfigService } from '@nestjs/config';
import { EmployeeModel } from './models/employee.model';
import { Repository } from './repository/repository';
import { ProjectModel } from './models/project.model';
import { LanguageModel } from './models/language.model';
import { EmployeeProjectModel } from './models/employee-project.model';
import { ProjectLanguageModel } from './models/project-language.model';
import * as pg from 'pg';
import { EmployeeCountModel } from './models/extended/employee.count.model';
import { EmployeeGroupResultModel } from './models/extended/employee-group-result.model';

function initPostgresTypes() {
  const pgTypeBigInt = 20;
  const pgTypeNumeric = 1700;
  pg.types.setTypeParser(pgTypeBigInt, function (value) {
    return parseInt(value);
  });

  pg.types.setTypeParser(pgTypeNumeric, function (value) {
    return parseFloat(value);
  });
}

@Module({
  imports: [
    ObjectionModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const config = configService.get<knex.Knex.Config>('database');
        if (config.client === 'pg') {
          initPostgresTypes();
        }
        return {
          config
        };
      }
    }),
    ObjectionModule.forFeature([
      EmployeeModel,
      EmployeeCountModel,
      EmployeeGroupResultModel,
      ProjectModel,
      EmployeeProjectModel,
      LanguageModel,
      ProjectLanguageModel
    ])
  ],
  providers: [Repository],
  exports: [ObjectionModule, Repository]
})
export class DatabaseModule {}
