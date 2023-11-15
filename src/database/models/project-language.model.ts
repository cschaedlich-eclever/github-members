import { BaseModel } from './base.model';

export class ProjectLanguageModel extends BaseModel {
  project_id: number;
  language_id: number;
  loc: number;

  static idColumn = ['project_id', 'language_id'];
  static tableName = 'projects_languages';
}
