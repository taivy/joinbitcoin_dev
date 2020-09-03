import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { CoinbaseAdsService } from './coinbaseAds.service';
import { CoinbaseAccessService } from './coinbaseAccess.service';
import { CoinbaseAccessDto, CoinbaseToAuth0MappingDto } from './coinbase.dto';
import { AdModel } from '../database/models/adCoinbase.model';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { UsePipes, ValidationPipe } from '@nestjs/common';



@Controller()
export class CoinbaseController {
  constructor(private adsService: CoinbaseAdsService, private accessService: CoinbaseAccessService) {}

  @Get('prices/:currencyPair/sell')
  async pricesCoinbase(@Req() request: Request, @Param('currencyPair') currencyPair: string) {
    const q = request.query;

    return this.adsService.getOffersFromApi(currencyPair);
  }

  @Post('access')
  @UsePipes(new ValidationPipe())
  async coinbaseAccess(@Body() coinbaseAccessDto: CoinbaseAccessDto) {
    console.log("coinbaseAccessDto", coinbaseAccessDto)

    return this.accessService.createCoinbaseAccess(coinbaseAccessDto);
  }

  @Post('auth0-mapping')
  @UsePipes(new ValidationPipe())
  async coinbaseIdToAuth0Mapping(@Body() coinbaseToAuth0MappingDto: CoinbaseToAuth0MappingDto) {
    console.log("coinbaseToAuth0MappingDto", coinbaseToAuth0MappingDto)
    return this.accessService.createCoinbaseIdToAuth0Mapping(coinbaseToAuth0MappingDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('access/:auth0UserId/')
  async getCoinbaseAccessRoute(@Param('auth0UserId') auth0UserId: string) {
    return this.accessService.getCoinbaseAccess(auth0UserId);
  }

}