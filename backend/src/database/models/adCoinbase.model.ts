import { BaseModel } from './base.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class AdModel extends BaseModel {
  static tableName = 'external.coinbase_ad';
  static upsertColumn = 'crypto_currency, currency';

  cryptoCurrency: string;
  currency: string;
  amount: string;
  vendor: string;
}
