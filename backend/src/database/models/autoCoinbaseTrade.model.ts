import { BaseModel } from './base.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class AutoCoinbaseTradeModel extends BaseModel {
  static tableName = 'trading.auto_trade';

  auth0Id: string;
  status: string;
  amount: number;
}
