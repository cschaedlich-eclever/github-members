import { Model, RelationMappings } from 'objection';
import { LanguageModel } from './language.model';
import { ProjectLanguageModel } from './project-language.model';
import { BaseModel } from './base.model';

export class ProjectModel extends BaseModel {
  id: number;
  name: string;
  languages?: LanguageModel[];

  static idColumn = 'id';
  static tableName = 'projects';

  static relationMappings: () => RelationMappings = () => ({
    languages: {
      relation: Model.ManyToManyRelation,
      modelClass: LanguageModel,
      join: {
        from: ProjectModel.tableName + '.id',
        through: {
          from: ProjectLanguageModel.tableName + '.project_id',
          to: ProjectLanguageModel.tableName + '.language_id',
          extra: 'loc'
        },
        to: LanguageModel.tableName + '.id'
      }
    }
  });
}
