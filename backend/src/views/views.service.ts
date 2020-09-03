import { Inject, Injectable, HttpService } from '@nestjs/common';
import { ModelClass, transaction } from 'objection';
import {map} from 'rxjs/operators';
import * as Knex from 'knex';

@Injectable()
export class ViewsService {

  constructor(private http: HttpService, @Inject('KnexConnection') private connection: Knex) {
    this.connection = connection;
  }

  async getUnitedTable(page: number, pageSize: number) {
    let qnt = await this.connection.raw(`select count(*) from vw_ads;`);

    let results = await this.connection.raw(`select * from vw_ads offset ${(page-1)*pageSize} limit ${pageSize};`);

    const response = {
      results: results["rows"],
      total: +qnt["rows"][0]["count"]
    }
    return response
  }
}
