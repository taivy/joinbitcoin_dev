import { BaseModel } from './base.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class UserBalanceModel extends BaseModel {
  static tableName = 'dca.balances';
  static upsertColumn = 'coinbase_id';

  coinbaseId: string;
  currency: string;
  balance: number;
  available: number;
  hold: number;
  profileId: string;
  tradingEnabled: boolean;
}
