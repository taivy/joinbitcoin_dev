import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import { connect } from 'react-redux'

import CoinbaseAuthButton from '../components/CoinbaseAuthButton';
import { getAndSetTokens } from '../actions'


class HomePage extends React.Component<any, any> {
  componentDidMount() {
    const { dispatch, coinbaseAuthClient } = this.props;
    const { isAuthenticated, user, getAccessTokenSilently } = this.props.auth0;
    if (isAuthenticated) {
      dispatch(getAndSetTokens(user, getAccessTokenSilently, coinbaseAuthClient))
    }
    
  }

  async getUserInfo() {
    const { getAccessTokenSilently } = this.props.auth0;

    let url = 'https://megalabs.us.auth0.com/userinfo'

    let token = await getAccessTokenSilently();

    const reqConfig = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }

    fetch(url, reqConfig).then(response => {
      response.json().then(data => {
        console.log("data", data)
        
      })
    });

  }

  render() {
    // this.getUserInfo();
    const { isAuthenticated, user } = this.props.auth0;
    const { coinbaseTokens } = this.props;

    let showCoinbaseLinkButton = false;
    if (isAuthenticated && coinbaseTokens.errorStatusCode === 404) {
      showCoinbaseLinkButton = true;
    }
    const coinbaseAuthClient = this.props.coinbaseAuthClient;
    return (
      <div>
        {showCoinbaseLinkButton && <CoinbaseAuthButton coinbaseAuthClient={coinbaseAuthClient} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { coinbaseTokens } = state;

  return {
    coinbaseTokens,
  }
}


export default connect(mapStateToProps)(withAuth0(HomePage));