import { Test, TestingModule } from '@nestjs/testing';
import { LocalBitcoinsAdsController } from './localbitcoins/localBitcoinsAds.controller.ts';
import { LocalBitcoinsAdsService } from './localbitcoins/localBitcoinsAds.service.ts';


describe('LocalBitcoinsAdsController', () => {
  let localBitcoinsAdsController: LocalBitcoinsAdsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LocalBitcoinsAdsController],
      providers: [LocalBitcoinsAdsService],
    }).compile();

    localBitcoinsAdsController = app.get<LocalBitcoinsAdsController>(LocalBitcoinsAdsController);
  });
});
