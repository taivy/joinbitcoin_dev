import ClientOAuth2 from "client-oauth2";


export const SET_TOKENS = 'SET_TOKENS'


export const setTokens = tokens => ({
  type: SET_TOKENS,
  tokens
})


export const getAndSetTokens = (user, getAccessTokenSilently, coinbaseAuthClient) => dispatch => {
    if (user.sub.includes("coinbase-api")) {
    	return dispatch(getCoinbaseAccessTokenFromAuth0Info(user, getAccessTokenSilently));
    } else {
    	return dispatch(getCoinbaseAccessTokenFromBackend(user, getAccessTokenSilently, coinbaseAuthClient));
    }
}


export async function sendTokensToServer(accessToken, refreshToken, coinbaseId) {
	const host = process.env.REACT_APP_SERVER_HOST;
	const port = process.env.REACT_APP_SERVER_PORT;
	const urlBase = `http://${host}:${port}/api/coinbase/access`;
	let url = new URL(urlBase);

	let data = {
	  "coinbaseId": coinbaseId,
	  "accessToken": accessToken,
	  "refreshToken": refreshToken
	}

	console.log("accessToken", accessToken)
	console.log("refreshToken", refreshToken)

	const reqConfig = {
	  method: 'POST',
	  body: JSON.stringify(data),
	  headers: {
	    "Content-Type": "application/json"
	  }
	}

	return fetch(url.href, reqConfig).then(response => {
	  response.json().then(data => {
	  	console.log("send tokens", data)
	  })
	});
}


export function sendAuth0UserToCoinbaseIdMappingToServer(coinbaseId, isAuthenticated, user) {
	if (user === undefined) {
	  return null
	}

	const host = process.env.REACT_APP_SERVER_HOST;
	const port = process.env.REACT_APP_SERVER_PORT;
	const urlBase = `http://${host}:${port}/api/coinbase/auth0-mapping`;
	let url = new URL(urlBase);

	let data = {
	  "coinbaseId": coinbaseId,
	  "auth0Id": user.sub,
	}

	const reqConfig = {
	  method: 'POST',
	  body: JSON.stringify(data),
	  headers: {
	    "Content-Type": "application/json"
	  }
	}

	return fetch(url.href, reqConfig).then(response => {
	  response.json().then(data => {
	  })
	});
}


const getCoinbaseAccessTokenFromBackend = (user, getAccessTokenSilently, coinbaseAuthClient) => async dispatch => {
	const host = process.env.REACT_APP_SERVER_HOST;
	const port = process.env.REACT_APP_SERVER_PORT;

	if (user === undefined) {
		return
	}
	let auth0UserId = user['sub'];
	console.log("auth0UserId", auth0UserId);

	const url = `http://${host}:${port}/api/coinbase/access/${auth0UserId}`;

	const token = await getAccessTokenSilently();

	const reqConfig = {
	  method: 'GET',
	  headers: {
	    Authorization: `Bearer ${token}`,
	  }
	}


	fetch(url, reqConfig).then(response => {
	  response.json().then(data => {
	    if (data.statusCode >= 400) {
		  dispatch(setTokens({
	      	coinbaseAccessToken: '',
	      	errorStatusCode: data.statusCode
	      }))
	      return
	    }
	    console.log("data", data)

	    const accessToken = data["accessToken"]
	    const refreshToken = data["refreshToken"]
	    const coinbaseId = data["coinbaseId"]

	    const token = coinbaseAuthClient.createToken(accessToken, refreshToken);

	    token.refresh().then(function (updatedToken) {
		  const coinbaseAccessToken = updatedToken.accessToken;

		  sendTokensToServer(updatedToken.accessToken, updatedToken.refreshToken, coinbaseId);

		  dispatch(setTokens({
	      	coinbaseAccessToken: coinbaseAccessToken,
	      	errorStatusCode: null
	      }))
	    }, (e) => console.log(e)) 
	  }, (e) => console.log(e))
    })
}


const getCoinbaseAccessTokenFromAuth0Info = (user, getAccessTokenSilently) => async dispatch => {
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
	    dispatch(setTokens({
      	  coinbaseAccessToken: data['http://megalabs:us:auth0:com/coinbaseAccessToken'],
      	  errorStatusCode: null
        }))
	  })
	});
}
