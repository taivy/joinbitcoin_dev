import { Module, HttpModule } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PaxfulAdsModule } from '../paxful/paxfulAds.module'
import { LocalBitcoinsAdsModule } from '../localbitcoins/localBitcoinsAds.module'
import { CoinbaseAdsModule } from '../coinbase/coinbaseAds.module'
import { TradesModule } from '../trades/trades.module'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [HttpModule, DatabaseModule, PaxfulAdsModule, LocalBitcoinsAdsModule, CoinbaseAdsModule, TradesModule],
  providers: [TasksService],
})
export class TasksModule {}
