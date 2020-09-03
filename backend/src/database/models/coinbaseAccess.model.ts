import { BaseModel } from './base.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class CoinbaseAccessModel extends BaseModel {
  static tableName = 'external.coinbase_access';
  static upsertColumn = 'coinbase_id';

  coinbaseId: string;
  accessToken: string;
  refreshToken: string;
}
