import { BaseModel } from './base.model';
import { UserModel } from './userPaxful.model';
import { Model, ModelClass } from 'objection';
import * as Knex from 'knex';

export class AdModel extends BaseModel {
  static tableName = 'external.paxful_ad';
  static upsertColumn = 'seller_id, fiat_usd_price_per_btc, currency';

  vendor: string;
  paymentType: string;
  fiatUsdPricePerCrypto: number;
  fiatUsdPricePerBtc: number;
  fiatAmountRangeMin: number;
  fiatAmountRangeMax: number;
  currency: string;

  sellerId: string;
  seller: UserModel;

  static relationMappings = {
    seller: {
      modelClass: `${__dirname}/userPaxful.model`,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'external.paxful_ad.sellerId',
        to: 'external.paxful_user.id'
      }
    }
   };

}
