import { BaseModel } from './base.model';

export class EmployeeProjectModel extends BaseModel {
  id: number;
  employee_id: number;
  project_id: number;

  static idColumn = ['employee_id', 'project_id'];
  static tableName = 'employees_projects';
}
