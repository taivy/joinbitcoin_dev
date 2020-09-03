import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import { sendTokensToServer, sendAuth0UserToCoinbaseIdMappingToServer } from '../actions'


class CoinbaseAuth extends React.Component<any, any> {
  componentDidMount() {
    const { coinbaseTokens, coinbaseAuthClient } = this.props;
    const { isAuthenticated, user } = this.props.auth0;

    if (window.location.href.includes("coinbaseId=")) {
      const windowUrl = window.location.search;
      const params = new URLSearchParams(windowUrl);

      let coinbaseId = params.get('coinbaseId') || '';
      if (coinbaseId !== '') {

        let res = sendAuth0UserToCoinbaseIdMappingToServer(coinbaseId, isAuthenticated, user)
        if (res) {
          res.then(() => {
            // redirect to the balances page
            window.location.href = window.location.origin + "/balances";
          })
        }
      }
      
    } else {
      this.getAccessToken();
    }
  }

  getAccessToken() {
    try {
      var coinbaseAuthClient = this.props.coinbaseAuthClient;
      var outerThis = this;
      coinbaseAuthClient.code.getToken(window.location.href)
        .then(function (user) {
          var token = coinbaseAuthClient.createToken(user.accessToken, user.refreshToken)

          const reqConfig = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token.accessToken
            }
          }

          fetch('https://api.coinbase.com/v2/user', reqConfig).then(response => {
            response.json().then(data => {
              let coinbaseId = data.data.id;

              sendTokensToServer(user.accessToken, user.refreshToken, coinbaseId).then(() => {
                window.location.href = window.location.origin + '/coinbase_auth?coinbaseId=' + coinbaseId; 
              })
              
            })
          });

        },
        function (err) {
          console.log(err)
          //window.location.href = window.location.origin; 
        })
    } catch(e) {
      console.error(e)
    }
  }


  render() {
    return (
      <></>
    );
  }
};


const mapStateToProps = state => {
  const { coinbaseTokens } = state;

  return {
    coinbaseTokens,
  }
}



export default connect(mapStateToProps)(withAuth0(CoinbaseAuth));
