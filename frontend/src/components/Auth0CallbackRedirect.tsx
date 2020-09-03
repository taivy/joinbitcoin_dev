import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';

import { sendAuth0UserToCoinbaseIdMappingToServer } from '../actions'


export class Auth0CallbackRedirect extends React.Component<any, any> {
  componentDidMount() {
  	this.getCoinbaseIdAndSendMappingToServer();
  }

  async getCoinbaseIdAndSendMappingToServer() {
    const { isAuthenticated, user, getAccessTokenSilently } = this.props.auth0;

	const url = 'https://' + process.env.REACT_APP_AUTH0_DOMAIN + '/userinfo';
	const token = await getAccessTokenSilently();

	const reqConfig = {
	  method: 'GET',
	  headers: {
	    'Authorization': 'Bearer ' + token
	  }
	}

	fetch(url, reqConfig).then(response => {
	  response.json().then(data => {
	    console.log("data!!", data)
	    const coinbaseId = data["http://megalabs:us:auth0:com/coinbaseId"];
	    sendAuth0UserToCoinbaseIdMappingToServer(coinbaseId, isAuthenticated, user)
	  })
	}) 
  }

  render() {
    // window.location.href = window.location.origin + "/balances";

    return (
      <></>
    );
  }
}

export default withAuth0(Auth0CallbackRedirect);
