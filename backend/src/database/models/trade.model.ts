import { BaseModel } from './base.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class TradeModel extends BaseModel {
  static tableName = 'trading.trades';
  static upsertColumn = 'auth0Id';

  coinbaseId: string;
  price: number;
  size: number;
  productId: string;
  side: string;
  stp: string;
  type: string;
  timeInForce: string;
  postOnly: string;
  createdAt: string;
  fillFees: number;
  filledSize: number;
  executedValue: number;
  status: string;
  settled: boolean;
}
