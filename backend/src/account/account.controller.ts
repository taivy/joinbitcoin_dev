import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { CoinbaseAccessTokenDto } from './account.dto';

@Controller()
export class AccountController {
  constructor(private service: AccountService) {}

  @Post('coinbase-pro/balances')
  @UsePipes(new ValidationPipe())
  async getAccountBalanceRoute(@Body() coinbaseAccessTokenDto: CoinbaseAccessTokenDto) {
    console.log("coinbaseAccessTokenDto", coinbaseAccessTokenDto)
    return this.service.getAccountBalance(coinbaseAccessTokenDto['accessToken']);
  }
}