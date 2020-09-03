import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'external.paxful_user';
  static upsertColumn = 'username';

  username: string;
  profileLink: string;
  lastOnline: number;
  feedbackPositive: number;
  feedbackNegative: number;
}
