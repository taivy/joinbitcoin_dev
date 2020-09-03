import { Inject, Injectable, HttpService, BadRequestException, NotFoundException } from '@nestjs/common';
import { ModelClass, transaction } from 'objection';
import { TradeModel } from '../database/models/trade.model';
import { AutoCoinbaseTradeModel } from '../database/models/autoCoinbaseTrade.model';
import { UtilsService } from '../utils/utils.service'
import {map, catchError} from 'rxjs/operators';


@Injectable()
export class TradesService {
  private readonly coinbaseApiUrl: string;

  constructor(private http: HttpService, private utils: UtilsService, @Inject('TradeModel') private modelClass: ModelClass<TradeModel>) {
    this.coinbaseApiUrl = process.env.COINBASE_API_URL;
    this.modelClass = TradeModel;
  }

  async create(propsTrade: Partial<TradeModel>) {
    const r = await TradeModel
      .upsert(propsTrade, null);
    return r
  }

  placeTradeOrder(side, productId: string, size, funds: number) {
    const outerThis = this;
    const apiPath = '/orders';
    const method = 'POST';
    const postBody = {
      type: "market",
      side: side,
      product_id: productId
    }
    if (size !=- -1) {
      postBody['size'] = size;
    }
    if (funds !=- -1) {
      postBody['funds'] = funds;
    }

    const postBodyString = JSON.stringify(postBody)

    const headers = this.utils.getCoinbaseAuthorizedRequestHeaders(method, apiPath, postBodyString);

    headers["Content-Type"] = "application/json";

    const config = {
      headers: headers
    }

    return this.http.post(this.coinbaseApiUrl + apiPath, postBodyString, config).pipe(
      map(function(response) {
        console.log(response);
        const data = response.data;

        const modelTrade: Partial<TradeModel> = {
          price: data.price,
          size: data.size,
          productId: data.product_id,
          side: data.side,
          stp: data.stp,
          type: data.type,
          timeInForce: data.time_in_force,
          postOnly: data.post_only,
          createdAt: data.created_at,
          fillFees: data.fill_fees,
          filledSize: data.filled_size,
          executedValue: data.executed_value,
          status: data.status,
          settled: data.settled,
          coinbaseId: data.id,
        }
        outerThis.create(modelTrade);

        return data;
      }),
      catchError(err => {
        console.log('caught error', err.response);
        console.log('caught error', err.response.data);
        throw new BadRequestException(`Status: ${err.response.status}, error text: '${err.response.data.message}'`);
      }),
    );
  }

  async getCoinbaseRecurringPurchases(auth0UserId: string) {
    if (auth0UserId.includes("%7C")) {
      auth0UserId = auth0UserId.replace(/%7C/g, "|")
    }
    
    const result = await AutoCoinbaseTradeModel.query()
      .select('*')
      .where('auth0Id', '=', auth0UserId);

    if (result.length == 0) {
      throw new NotFoundException();
    }
    return result
  }

  async updateCoinbaseRecurringPurchases(props: Partial<AutoCoinbaseTradeModel>) {
    let r;

    if (props['id_']) {
      let id_ = props['id_'];
      delete props['id_'];
      props['status'] = 'new';
      r = await AutoCoinbaseTradeModel.query()
      .findById(id_)
      .patch(props);
    } else {
      r = await AutoCoinbaseTradeModel.query()
      .insert(props);
    }
    
    return r
  }

  async deleteCoinbaseRecurringPurchases(auth0UserId: string) {
    const result = await AutoCoinbaseTradeModel.query()
      .delete()
      .where('auth0Id', '=', auth0UserId);
    return result
  }

}
