import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { HomePage, LBCTable, UnitedTable, BalancesTable, ScheduleRecurringPurchasePage } from '../pages'
import PrivateRoute from './PrivateRoute'
import SiderMenu from './SiderMenu';
import CoinbaseAuth from './CoinbaseAuth';
import Auth0CallbackRedirect from './Auth0CallbackRedirect';

import { withAuth0 } from '@auth0/auth0-react';
import ClientOAuth2 from "client-oauth2";

const { Header, Content, Footer } = Layout;



type State = {
  coinbaseAuthClient: any;
}


export class DefaultLayout extends React.Component<any, State> {
  state: State = {
    coinbaseAuthClient: null,
  };

  componentWillMount() {
    this.createCoinbaseClient();
  }

  createCoinbaseClient() {
    var coinbaseAuth = new ClientOAuth2({
      clientId: 'de15a01427c3bd6c6aaa7856cd8a158b937fa33f9b6ae73159b762b0b2df9bdc',
      clientSecret: '29056283ea79910b46639bfd6abad72018088791ba3ee507e37ef9ccc3ba240a',
      accessTokenUri: 'https://api.coinbase.com/oauth/token',
      authorizationUri: 'https://www.coinbase.com/oauth/authorize',
      redirectUri: window.location.origin + '/coinbase_auth',
      scopes: ['wallet:buys:create', 'wallet:user:read', 'wallet:accounts:read', 'wallet:payment-methods:read']
    })
    this.setState({
      coinbaseAuthClient: coinbaseAuth
    })
  }


  render() {
    const coinbaseAuthClient = this.state.coinbaseAuthClient;

    return (
      <BrowserRouter>
        <Layout>
          <SiderMenu />
          <Layout>
            <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
            <Content style={{ margin: '24px 16px 0' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Switch>
                  <Route exact path="/" component={() => <HomePage coinbaseAuthClient={coinbaseAuthClient} />} />
                  <PrivateRoute exact path="/auth0_callback" component={Auth0CallbackRedirect} />
                  <Route path="/coinbase_auth" component={() => <CoinbaseAuth coinbaseAuthClient={coinbaseAuthClient} />} />
                  <PrivateRoute exact path="/buy-bitcoin" component={LBCTable} />
                  <PrivateRoute exact path="/united-view" component={UnitedTable} />
                  <PrivateRoute exact path="/balances" component={() => <BalancesTable coinbaseAuthClient={coinbaseAuthClient} />} />
                  <PrivateRoute exact path="/schedule_recurring_purchase" component={ScheduleRecurringPurchasePage} />
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2020</Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default withAuth0(DefaultLayout);


