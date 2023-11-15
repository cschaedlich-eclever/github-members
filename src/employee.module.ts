import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ApiController } from './controller/api.controller';
import { EmployeeService } from './service/employee.service';
import { DatabaseModule } from './database/database.module';
import { GithubApiClient } from './client/github-api.client';
import { ImportService } from './service/import.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !process.env.NODE_ENV
        ? '.env'
        : `.env.${process.env.NODE_ENV}`,
      load: [configuration]
    }),
    DatabaseModule,
    HttpModule.register({}),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, ApiController],
  providers: [EmployeeService, GithubApiClient, ImportService]
})
export class EmployeeModule {}
