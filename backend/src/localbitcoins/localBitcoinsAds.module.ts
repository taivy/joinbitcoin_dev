import { Module, HttpModule } from '@nestjs/common';
import { LocalBitcoinsAdsController } from './localBitcoinsAds.controller';
import { LocalBitcoinsAdsService } from './localBitcoinsAds.service';
import { LocalBitcoinsUserService } from './localBitcoinsUser.service';

@Module({
  imports: [HttpModule],
  controllers: [LocalBitcoinsAdsController],
  providers: [LocalBitcoinsAdsService, LocalBitcoinsUserService],
  exports: [LocalBitcoinsAdsService]
})
export class LocalBitcoinsAdsModule {}
