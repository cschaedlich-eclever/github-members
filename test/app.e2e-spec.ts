import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EmployeeModule } from '../src/employee.module';
import { validate } from 'class-validator';
import { EmployeeResultDto } from '../src/dto/employee-result.dto';

describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmployeeModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 180000);

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/employees', async () => {
    const result = await request(app.getHttpServer()).get('/api/employees');

    expect(result.status).toBe(200);

    const employeeResult = new EmployeeResultDto();
    Object.assign(employeeResult, result.body);
    expect((await validate(employeeResult)).length).toBe(0);

    expect(employeeResult.data.length).toBeGreaterThan(0);
    expect(employeeResult.total).toBeGreaterThan(0);
    employeeResult.data.forEach((x) => {
      expect(x.name).toBeDefined();
      x.languages.forEach((l) => {
        expect(l.loc).toBeGreaterThan(0);
        expect(l.count).toBeGreaterThan(0);
        expect(l.name).toBeDefined();
      });
    });
  });

  it('GET /api/employees?language=Java', async () => {
    const result = await request(app.getHttpServer()).get(
      '/api/employees?language=Java'
    );

    expect(result.status).toBe(200);

    const employeeResult = new EmployeeResultDto();
    Object.assign(employeeResult, result.body);
    expect((await validate(employeeResult)).length).toBe(0);

    expect(employeeResult.total).toBeGreaterThan(0);
    expect(employeeResult.data.length).toBeGreaterThan(0);
    employeeResult.data.forEach((x) => {
      expect(x.languages.length).toBe(1);
      expect(x.languages[0].name).toBe('Java');
    });
  });

  it('GET /api/employees?language=Unknown', async () => {
    const result = await request(app.getHttpServer()).get(
      '/api/employees?language=Unknown'
    );

    expect(result.status).toBe(200);

    const employeeResult = new EmployeeResultDto();
    Object.assign(employeeResult, result.body);
    expect((await validate(employeeResult)).length).toBe(0);

    expect(employeeResult.data.length).toBe(0);
    expect(employeeResult.total).toBe(0);
  });
});
