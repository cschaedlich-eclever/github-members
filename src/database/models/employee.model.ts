import { Model, RelationMappings } from 'objection';
import { EmployeeProjectModel } from './employee-project.model';
import { ProjectModel } from './project.model';
import { BaseModel } from './base.model';

export class EmployeeModel extends BaseModel {
  id: number;
  login: string;
  name: string | null;
  projects: ProjectModel[];

  static idColumn = 'id';
  static tableName = 'employees';

  static relationMappings: () => RelationMappings = () => ({
    projects: {
      relation: Model.ManyToManyRelation,
      modelClass: ProjectModel,
      join: {
        from: EmployeeModel.tableName + '.id',
        through: {
          from: EmployeeProjectModel.tableName + '.employee_id',
          to: EmployeeProjectModel.tableName + '.project_id'
        },
        to: ProjectModel.tableName + '.id'
      }
    }
  });
}
