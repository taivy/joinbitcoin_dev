import React from 'react';

import { Table } from 'antd';
import { withAuth0 } from '@auth0/auth0-react';
import { connect } from 'react-redux'

import CoinbaseAuthButton from '../components/CoinbaseAuthButton';
import { getAndSetTokens } from '../actions'


const columns = [
  {
    title: 'Currency',
    dataIndex: 'currency'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
  }
];

class BalancesTable extends React.Component<any, any> {
  state = {
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
    },
    loading: false,
    balancesNotFound: false,
    coinbaseAccessToken: ""
  };

  componentDidMount() {
    const { dispatch, coinbaseAuthClient } = this.props;
    const { user, getAccessTokenSilently } = this.props.auth0;
    dispatch(getAndSetTokens(user, getAccessTokenSilently, coinbaseAuthClient))
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if ((nextProps.coinbaseTokens.coinbaseAccessToken !== '') && (this.props.coinbaseTokens.coinbaseAccessToken !== '') && (this.state.data.length === 0)) {
    	this.fetchBalancesTable(nextProps.coinbaseTokens.coinbaseAccessToken)
    }
    
    return true
  }

  fetchBalancesTable(coinbaseAccessToken) {
    const host = process.env.REACT_APP_SERVER_HOST;
    const port = process.env.REACT_APP_SERVER_PORT;

    const url = `http://${host}:${port}/api/account/coinbase-pro/balances`;

  	const data = {
  	  accessToken: coinbaseAccessToken
  	}

    const reqConfig = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }

    const outerThis = this;

    fetch(url, reqConfig).then(response => {
      response.json().then(data => {

        this.setState({
          loading: false,
          data: data
        });

      })
    })
  }


  render() {
    const { data, loading, balancesNotFound } = this.state;
    const { coinbaseTokens, coinbaseAuthClient } = this.props;
    let errorStatusCode = coinbaseTokens.errorStatusCode;

    return (
      <>
        {(errorStatusCode === 404) ? (
        <>
          <p>Your account isn't linked to Coinbase</p>
          <CoinbaseAuthButton coinbaseAuthClient={coinbaseAuthClient} />
        </>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  const { coinbaseTokens } = state;

  return {
    coinbaseTokens,
  }
}



export default connect(mapStateToProps)(withAuth0(BalancesTable));