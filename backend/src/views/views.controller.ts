import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, Req } from '@nestjs/common';
import { ViewsService } from './views.service';
import { Request } from 'express';

@Controller()
export class ViewsController {
  constructor(private service: ViewsService) {}

  @Get('get-united-table')
  async getUnitedTable(@Req() request: Request) {
    const q = request.query;
    const page = (q.current === undefined ? 1 : +q.current);
    const pageSize = (q.pageSize === undefined ? 10 : +q.pageSize);

    return this.service.getUnitedTable(page, pageSize);
  }
}