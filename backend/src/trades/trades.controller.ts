import { Body, Controller, Get, Post, Delete, Param, Query, ParseIntPipe, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { TradesService } from './trades.service';
import { RecurringCoinbasePurchaseDto } from './trades.dto';
import { Request } from 'express'; 
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class TradesController {
  constructor(private service: TradesService) {}

  @Get('coinbase-pro')
  async placeTradeOrderRoute(@Req() request: Request) {
    const q = request.query;
    const side = (q.side === undefined ? "sell" : q.side);
    const productId = (q.productId === undefined ? "BTC-USD" : q.productId);
    if (q.size === undefined && q.funds === undefined) {
      throw new BadRequestException("You must specify 'size' or 'funds' parameter");
    }
    const size = (q.size === undefined ? -1 : +q.size);
    const funds = (q.funds === undefined ? -1 : +q.funds);
    let res;
    try {
      res = this.service.placeTradeOrder(side, productId as string, size, funds);
    } catch(e) {
      console.log("err", e);
    }
    return res
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('coinbase/recurring_purchase/:auth0UserId')
  async getCoinbaseRecurringPurchasesRoute(@Param('auth0UserId') auth0UserId: string) {
    return this.service.getCoinbaseRecurringPurchases(auth0UserId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('coinbase/recurring_purchase')
  async updateCoinbaseRecurringPurchasesRoute(@Body() recurringCoinbasePurchaseDto: RecurringCoinbasePurchaseDto) {
    return this.service.updateCoinbaseRecurringPurchases(recurringCoinbasePurchaseDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('coinbase/recurring_purchase/:purchaseId')
  async deleteCoinbaseRecurringPurchasesRoute(@Param('purchaseId') purchaseId: string) {
    return this.service.deleteCoinbaseRecurringPurchases(purchaseId)
  }

}