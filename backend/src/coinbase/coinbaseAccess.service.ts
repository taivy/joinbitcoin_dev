import { Inject, Injectable, HttpService, NotFoundException } from '@nestjs/common';
import { CoinbaseAccessModel } from '../database/models/coinbaseAccess.model';
import { CoinbaseAuth0IdsModel } from '../database/models/coinbaseAuth0Ids.model';
import { UtilsService } from '../utils/utils.service'
import { ModelClass, transaction } from 'objection';
import {map} from 'rxjs/operators';


@Injectable()
export class CoinbaseAccessService {
  private readonly coinbaseApiUrl: string;

  constructor(private http: HttpService, private utils: UtilsService) {
    this.coinbaseApiUrl = 'https://api.coinbase.com/v2/';
  }

  async createCoinbaseAccess(props: Partial<CoinbaseAccessModel>) {
    props['accessToken'] = this.utils.encrypt(props['accessToken'], process.env.ENCRYPTION_KEY);
    props['refreshToken'] = this.utils.encrypt(props['refreshToken'], process.env.ENCRYPTION_KEY);
    const r = await CoinbaseAccessModel
      .upsert(props, null);
    return {"success": true}
  }

  async getCoinbaseAccess(auth0UserId: string) {
    const coinbaseIds = await CoinbaseAuth0IdsModel.query()
      .select('coinbaseId', 'auth0Id')
      .where('auth0Id', '=', auth0UserId);
    if (coinbaseIds.length === 0) {
      console.log("no coinbaseIds")
      throw new NotFoundException();
    }
    const coinbaseId = coinbaseIds[0];
    console.log("coinbaseId", coinbaseId)
    console.log("coinbaseId['coinbaseId']", coinbaseId['coinbaseId'])
    let coinbaseAccess_ = await CoinbaseAccessModel.query()
      .select('accessToken', 'refreshToken')
      .where('coinbaseId', '=', coinbaseId['coinbaseId']);
    if (coinbaseAccess_.length === 0) {
      throw new NotFoundException();
    }
    const coinbaseAccess = coinbaseAccess_[0];
    const coinbaseAccessObj = {
      accessToken: coinbaseAccess.accessToken,
      refreshToken: coinbaseAccess.refreshToken,
      coinbaseId: coinbaseId['coinbaseId']
    }
    coinbaseAccessObj['accessToken'] = this.utils.decrypt(coinbaseAccessObj['accessToken'], process.env.ENCRYPTION_KEY);
    coinbaseAccessObj['refreshToken'] = this.utils.decrypt(coinbaseAccessObj['refreshToken'], process.env.ENCRYPTION_KEY);

    return coinbaseAccessObj
  }

  async createCoinbaseIdToAuth0Mapping(props: Partial<CoinbaseAuth0IdsModel>) {
    /*
    const r = await CoinbaseAuth0IdsModel.query()
      .insert(props);
    */
    const r = await CoinbaseAuth0IdsModel
      .upsert(props, null);
    
    return r
  }
}
