import { Inject, Injectable, HttpService } from '@nestjs/common';
import { AdModel } from '../database/models/adLocalbitcoins.model';
import { UserModel } from '../database/models/userLocalbitcoins.model';
import { ModelClass, transaction } from 'objection';
import { LocalBitcoinsUserService } from './localBitcoinsUser.service';
import {map} from 'rxjs/operators';

@Injectable()
export class LocalBitcoinsAdsService {
  private readonly localbitcoinsApiUrl: string;

  constructor(private http: HttpService, private userService: LocalBitcoinsUserService, @Inject('AdModel') private modelClass: ModelClass<AdModel>) {
    this.localbitcoinsApiUrl = 'https://localbitcoins.com/';
    console.log('modelClass lbc', AdModel)
    this.modelClass = AdModel;
  }

  async create(propsAd: Partial<AdModel>, propsUser: Partial<UserModel>) {
    const r1 = await UserModel
      .upsert(propsUser, null);

    propsAd.sellerId = r1["rows"][0]["id"]

    const r = await AdModel
      .upsert(propsAd, null);
    return r
  }

  buyBitcoinsOnlineContryCodeName(countryname: string, countrycode: string) {
    const outerThis = this;

    return this.http.get(this.localbitcoinsApiUrl + `/buy-bitcoins-online/${countrycode}/${countryname}/.json`).pipe(
      map(function(response) {
        response.data.data.ad_list.map(async function(topObj) {
          let data = topObj.data;
          const vendor = 'localbitcoins';
          const modelAd: Partial<AdModel> = {
            vendor: vendor,
            rating: data.profile.feedback_score,
            paymentType: data.online_provider,
            price: data.temp_price_usd,
            minBtc: data.min_amount,
            maxBtc: data.max_amount,
            currency: data.currency
          }

          const modelUser: Partial<UserModel> = {
            username: data.profile.username,
            feedbackScore: data.profile.feedback_score,
            name: data.profile.name,
            lastOnline: data.profile.last_online,
            tradeCount: data.profile.trade_count,
          }
          outerThis.create(modelAd, modelUser);
        })

        return response.data;
      })
    );
  }

  async getOffers(currency: string, price: number, page: number, pageSize: number) {
    let q = this.modelClass.query()
     .select("*")

    console.log('lbc', this.modelClass);

    let qCount = this.modelClass.query()
      .count("*")

    for (let qry of [q, qCount]) {
      qry = qry
        .join('external.localbitcoins_user', 'external.localbitcoins_user.id', '=', 'external.localbitcoins_ad.seller_id')
        .where('external.localbitcoins_ad.currency', currency)
    }

    if (price !== -1) {
      for (let qry of [q, qCount]) {
        qry = qry.where('external.localbitcoins_ad.price', '<', price)
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
