import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  static tableName = 'external.localbitcoins_user';
  static upsertColumn = 'username';

  username: string;
  name: string;
  lastOnline: string;
  tradeCount: string;
  feedbackScore: number;
}
