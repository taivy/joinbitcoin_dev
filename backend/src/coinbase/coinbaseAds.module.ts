import { Module, HttpModule } from '@nestjs/common';
import { CoinbaseController } from './coinbase.controller';
import { CoinbaseAdsService } from './coinbaseAds.service';
import { CoinbaseAccessService } from './coinbaseAccess.service';
import { UtilsModule } from '../utils/utils.module'


@Module({
  imports: [HttpModule, UtilsModule],
  controllers: [CoinbaseController],
  providers: [CoinbaseAdsService, CoinbaseAccessService],
  exports: [CoinbaseAdsService, CoinbaseAccessService]
})
export class CoinbaseAdsModule {}
