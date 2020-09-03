import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, Req } from '@nestjs/common';
import { PaxfulAdsService } from './paxfulAds.service';
import { AdModel } from '../database/models/adPaxful.model';
import { Request } from 'express';

@Controller()
export class  PaxfulAdsController {
  constructor(private adsService: PaxfulAdsService) {}

  @Get('offer/all/:offertype')
  async buyBitcoinsOnlineContryCodeName(@Req() request: Request, @Param('offertype') offertype) {
    const q = request.query;
    const paymentMethod = q.payment_method || '';
    const currency = q.currency_code || 'usd';
    const fiatMin = q.fiat_min || '';
    const group = q.group || '';
    const geonameId = q.geoname_id || '';

    return this.adsService.getOffersFromApi(offertype, paymentMethod as string, currency as string, fiatMin as string, group as string, geonameId as string);
  }
}