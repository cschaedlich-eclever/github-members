import { BaseModel } from './base.model';

export class LanguageModel extends BaseModel {
  id: number;
  name: string;

  static idColumn = 'id';
  static tableName = 'languages';
}
