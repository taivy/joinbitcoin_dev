import { Inject, Injectable, HttpService } from '@nestjs/common';
import { AdModel } from '../database/models/adPaxful.model';
import { UserModel } from '../database/models/userPaxful.model';
import { ModelClass, transaction } from 'objection';
import { PaxfulUserService } from './paxfulUser.service';
import {map} from 'rxjs/operators';

@Injectable()
export class PaxfulAdsService {
  private readonly paxfulApiUrl: string;

  constructor(private http: HttpService, private userService: PaxfulUserService, @Inject('AdModel') private modelClass: ModelClass<AdModel>) {
    this.paxfulApiUrl = 'https://paxful.com/api/';
    console.log('modelClass paxful', AdModel)
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

  getOffersFromApi(offertype: string, paymentMethod: string, currency: string, fiatMin: string, group: string, geonameId: string) {
    const outerThis = this;

    const params = new URLSearchParams();
    params.append('offer_type', offertype || 'buy');
    params.append('payment_method', paymentMethod || '');
    params.append('currency', currency || '');
    params.append('fiat_min', fiatMin || '');
    params.append('group', group || '');
    params.append('geoname_id', geonameId || '');

    const config = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "text/plain"
      }
    }

    return this.http.post(this.paxfulApiUrl + `offer/all` + `?` + params, params, config).pipe(
      map(function(response) {
        response.data.data.offers.map(async function(data) {
          const vendor = 'paxful';
          const modelAd: Partial<AdModel> = {
            vendor: vendor,
            paymentType: data.payment_method_name,
            fiatUsdPricePerCrypto: data.fiat_usd_price_per_crypto,
            fiatUsdPricePerBtc: data.fiat_USD_price_per_btc,
            fiatAmountRangeMin: data.fiat_amount_range_min,
            fiatAmountRangeMax: data.fiat_amount_range_max,
            currency: data.currency_code
          }

          const modelUser: Partial<UserModel> = {
            username: data.offer_owner_username,
            feedbackPositive: data.offer_owner_feedback_positive,
            feedbackNegative: data.offer_owner_feedback_negative,
            profileLink: data.offer_owner_profile_link,
            lastOnline: data.last_seen_timestamp,
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

    console.log('paxful', this.modelClass);

    let qCount = this.modelClass.query()
      .count("*")

    for (let qry of [q, qCount]) {
      qry = qry
        .join('external.paxful_user', 'external.paxful_user.id', '=', 'external.paxful_ad.seller_id')
        .where('external.paxful_ad.currency', currency)
    }

    if (price !== -1) {
      for (let qry of [q, qCount]) {
        qry = qry.where('external.paxful_ad.price', '<', price)
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
