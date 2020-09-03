import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { LocalBitcoinsAdsService } from './localBitcoinsAds.service';
import { AdModel } from '../database/models/adLocalbitcoins.model';
import { Request } from 'express'; 
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class  LocalBitcoinsAdsController {
  constructor(private adsService: LocalBitcoinsAdsService) {}

  @Get('buy-bitcoins-online/:countrycode/:countryname/')
  async buyBitcoinsOnlineContryCodeName(@Param('countryname') countryname, @Param('countrycode') countrycode) {
    return this.adsService.buyBitcoinsOnlineContryCodeName(countryname, countrycode);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-offers/:currency/')
  async getOffersFromDB(@Req() request: Request, @Param('currency') currency: string) {
    const q = request.query;
    const page = (q.current === undefined ? 1 : +q.current);
    const pageSize = (q.pageSize === undefined ? 10 : +q.pageSize);
    const price = (q.price === undefined ? -1 : +q.price);
    return this.adsService.getOffers(currency, price, page, pageSize);
  }
}