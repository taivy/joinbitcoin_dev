import { BaseModel } from './base.model';
import { UserModel } from './userLocalbitcoins.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class AdModel extends BaseModel {
  static tableName = 'external.localbitcoins_ad';
  static upsertColumn = 'seller_id, price, currency';

  vendor: string;
  rating: number;
  paymentType: string;
  price: number;
  minBtc: number;
  maxBtc: number;
  currency: string;

  sellerId: string;
  seller: UserModel;

  static relationMappings = {
    seller: {
      modelClass: `${__dirname}/userLocalbitcoins.model`,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'external.localbitcoins_ad.sellerId',
        to: 'external.localbitcoins_user.id'
      }
    }
   };
}
