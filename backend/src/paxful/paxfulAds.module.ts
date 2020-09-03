import { Module, HttpModule } from '@nestjs/common';
import { PaxfulAdsController } from './paxfulAds.controller';
import { PaxfulAdsService } from './paxfulAds.service';
import { PaxfulUserService } from './paxfulUser.service';

@Module({
  imports: [HttpModule],
  controllers: [PaxfulAdsController],
  providers: [PaxfulAdsService, PaxfulUserService],
  exports: [PaxfulAdsService]
})
export class PaxfulAdsModule {}
