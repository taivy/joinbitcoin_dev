import { BaseModel } from './base.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class CoinbaseAuth0IdsModel extends BaseModel {
  static tableName = 'external.coinbase_auth0_ids';
  static upsertColumn = 'coinbase_id';

  coinbaseId: string;
  auth0Id: string;
}
