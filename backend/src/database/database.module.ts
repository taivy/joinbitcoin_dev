import { Global, Module } from '@nestjs/common';
import * as Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { AdModel as AdLocalbitcoinsModel } from './models/adLocalbitcoins.model';
import { AdModel as AdPaxfulModel } from './models/adPaxful.model';
import { AdModel as AdCoinbaseModel } from './models/adCoinbase.model';
import { UserModel as UserLocalbitcoinsModel } from './models/userLocalbitcoins.model';
import { UserModel as UserPaxfulModel } from './models/userPaxful.model';
import { UserBalanceModel } from './models/userBalance.model';
import { TradeModel } from './models/trade.model';
import { AutoCoinbaseTradeModel } from './models/autoCoinbaseTrade.model';
import { CoinbaseAccessModel } from './models/coinbaseAccess.model';
import { CoinbaseAuth0IdsModel } from './models/coinbaseAuth0Ids.model';

const models = [AdLocalbitcoinsModel, UserLocalbitcoinsModel, AdPaxfulModel, UserPaxfulModel, 
AdCoinbaseModel, UserBalanceModel, TradeModel, CoinbaseAccessModel, CoinbaseAuth0IdsModel, 
AutoCoinbaseTradeModel];

const modelProviders = models.map(model => {
  return {
    provide: model.name,
    useValue: model
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
        debug: process.env.KNEX_DEBUG === 'true',
        ...knexSnakeCaseMappers()
      });

      Model.knex(knex);
      return knex;
    }
  }
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers]
})
export class DatabaseModule {}
