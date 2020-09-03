import { Inject, Injectable, HttpService } from '@nestjs/common';
import { ModelClass, transaction } from 'objection';
import { UserBalanceModel } from '../database/models/userBalance.model';
import { UtilsService } from '../utils/utils.service'
import {map, catchError} from 'rxjs/operators';


@Injectable()
export class AccountService {
  private readonly coinbaseApiUrl: string;

  constructor(private http: HttpService, private utils: UtilsService, @Inject('UserBalanceModel') private modelClass: ModelClass<UserBalanceModel>) {
    this.coinbaseApiUrl = process.env.COINBASE_PRO_API_URL;
    this.modelClass = UserBalanceModel;
  }

  async create(propsBalance: Partial<UserBalanceModel>) {
    const r = await UserBalanceModel
      .upsert(propsBalance, null);
    return r
  }

  async getAccountBalance(accessToken: string) {
    const outerThis = this;
    const apiPath = '/accounts';

    const config = {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'CB-VERSION': '2020-02-19',
      }
    }

    return this.http.get(this.coinbaseApiUrl + apiPath, config).pipe(
      map(function(response) {
        let balances = [];
        response.data.data.map(async function(data) {
          const modelUserBalance: Partial<UserBalanceModel> = {
            currency: data.currency.code,
            balance: data.balance.amount,
            hold: data.hold,
            available: data.available,
            profileId: data.profile_id,
            tradingEnabled: data.trading_enabled,
            coinbaseId: data.id,
          }
          outerThis.create(modelUserBalance);
          balances.push(modelUserBalance);
        })

        return balances;
      }),
      catchError(err => {
        console.log('caught mapping error', err);
        return err;
      }),
    );

  }
}
