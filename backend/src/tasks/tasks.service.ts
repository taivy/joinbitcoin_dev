import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoinbaseAdsService } from '../coinbase/coinbaseAds.service'
import { PaxfulAdsService } from '../paxful/paxfulAds.service'
import { LocalBitcoinsAdsService } from '../localbitcoins/localBitcoinsAds.service'
import { TradesService } from '../trades/trades.service';
import { AutoCoinbaseTradeModel } from '../database/models/autoCoinbaseTrade.model';
import * as readYaml from 'read-yaml'
import * as path from 'path'


@Injectable()
export class TasksService {
  constructor(private coinbaseAdsService: CoinbaseAdsService, private paxfulAdsService: PaxfulAdsService, private localbitcoinsAdsService: LocalBitcoinsAdsService, private tradesService: TradesService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 * * * *')
  handleCron() {
    this.logger.debug('Task is being run');
    let outerThis = this;
    readYaml('/app/src/tasks/taks_config.yaml', function(err, data) {
      if (err) throw err;

      let r1 = outerThis.coinbaseAdsService.getOffersFromApi(data.coinbase.currencyPair);
      // wait until result received
      r1.subscribe(val => val);

      const paxfulSettings = data.paxful;
      let r2 = outerThis.paxfulAdsService.getOffersFromApi(paxfulSettings.offertype, paxfulSettings.paymentMethod as string, paxfulSettings.currency as string, paxfulSettings.fiatMin as string, paxfulSettings.group as string, paxfulSettings.geonameId as string);
      // wait until result received
      r2.subscribe(val => val);

      let r3 = outerThis.localbitcoinsAdsService.buyBitcoinsOnlineContryCodeName(data.localbitcoins.countryname, data.localbitcoins.countrycode);
      // wait until result received
      r3.subscribe(val => val);

      outerThis.logger.debug('Task is finished');
    })
  }

  @Cron('0 0 * * 0')
  handleCronTrading() {
    this.logger.debug('Trading task is being run');
    let outerThis = this;
    readYaml('/app/src/tasks/taks_config.yaml', function(err, data) {
      if (err) throw err;

      const settings = data.coinbaseTrades;

      let r = outerThis.tradesService.placeTradeOrder(settings.side, settings.productId, settings.size, settings.funds);
      // wait until result received
      r.subscribe(val => val);

      outerThis.logger.debug('Trading task is finished');
    })
  }


  @Cron('0 0 * * 6')
  handleCronTradingAutoPurchases() {
    this.logger.debug('Trading task is being run');

    /*

    const result = await AutoCoinbaseTradeModel.query()
      .select('*')

    for (purchase of result) {
      let r = outerThis.tradesService.placeTradeOrder(settings.side, settings.productId, settings.size, settings.funds);
      let val = '';
      r.subscribe(val => val);

    }
    */

    this.logger.debug('Auto purchases trading task is finished');
  }

}
