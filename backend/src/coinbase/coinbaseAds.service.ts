import { Inject, Injectable, HttpService } from '@nestjs/common';
import { AdModel } from '../database/models/adCoinbase.model';
import { ModelClass, transaction } from 'objection';
import {map} from 'rxjs/operators';

@Injectable()
export class CoinbaseAdsService {
  private readonly coinbaseApiUrl: string;

  constructor(private http: HttpService, @Inject('AdModel') private modelClass: ModelClass<AdModel>) {
    this.coinbaseApiUrl = 'https://api.coinbase.com/v2/';
    this.modelClass = AdModel;
  }

  async create(propsAd: Partial<AdModel>) {
    const r = await AdModel
      .upsert(propsAd, null);
    return r
  }

  getOffersFromApi(currencyPair: string) {
    const outerThis = this;

    return this.http.get(this.coinbaseApiUrl + `prices/${currencyPair}/sell`).pipe(
      map(function(response) {
        const data = response.data.data;
        const vendor = 'coinbase';
        const cryptoCurrency = currencyPair.split("-")[0];
        const modelAd: Partial<AdModel> = {
          vendor: vendor,
          cryptoCurrency: cryptoCurrency,
          currency: data.currency,
          amount: data.amount
        }
        outerThis.create(modelAd);
        return response.data;
      })
    );
  }

  async getOffers(currency: string, price: number, page: number, pageSize: number) {
    let q = this.modelClass.query()
     .select("*")

    console.log('paxful', this.modelClass);

    let qCount = this.modelClass.query()
      .count("*")

    if (price !== -1) {
      for (let qry of [q, qCount]) {
        qry = qry.where('external.coinbase_ad.amount', '<', price)
      }
    }
    const count = await qCount;

    const results = await q
      .limit(pageSize)
      .offset((page-1)*pageSize);

    const response = {
      results: results,
      total: +count[0]["count"]
    }
    return response
  }
}
