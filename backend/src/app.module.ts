import { Module } from '@nestjs/common';
import { LocalBitcoinsAdsModule } from './localbitcoins/localBitcoinsAds.module';
import { PaxfulAdsModule } from './paxful/paxfulAds.module';
import { CoinbaseAdsModule } from './coinbase/coinbaseAds.module';
import { LocalBitcoinsModule } from './localbitcoins/localBitcoins.module';
import { PaxfulModule } from './paxful/paxful.module';
import { CoinbaseModule } from './coinbase/coinbase.module';
import { ViewsModule } from './views/views.module';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { RouterModule, Routes } from 'nest-router';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountModule } from './account/account.module';
import { TradesModule } from './trades/trades.module';
import { UtilsModule } from './utils/utils.module';
import { AuthzModule } from './authz/authz.module';


export const routes: Routes = [
  {
    path: '/api/localbitcoins',
    module: LocalBitcoinsModule,
    children: [{ path: '/', module: LocalBitcoinsAdsModule }],
  },
  {
    path: '/api/paxful',
    module: PaxfulModule,
    children: [{ path: '/', module: PaxfulAdsModule }],
  },
  {
    path: '/api/coinbase',
    module: CoinbaseModule,
    children: [{ path: '/', module: CoinbaseAdsModule }],
  },
  {
    path: '/api/views',
    module: ViewsModule,
  },
  {
    path: '/api/account',
    module: AccountModule,
  },
  {
    path: '/api/trades',
    module: TradesModule,
  }
];

@Module({
  imports: [
  RouterModule.forRoutes(routes),
  LocalBitcoinsAdsModule,
  PaxfulAdsModule,
  CoinbaseAdsModule,
  ViewsModule,
  DatabaseModule,
  TasksModule,
  AccountModule,
  TradesModule,
  UtilsModule,
  ScheduleModule.forRoot(),
  AuthzModule
  ],
})
export class AppModule {}
