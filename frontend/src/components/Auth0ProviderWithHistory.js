import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { history } from "./History";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  console.log("window.location.origin", window.location.origin)

  const onRedirectCallback = (appState) => {
    console.log("onRedirectCallback")
    console.log(appState)
    history.replace((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin + "/auth0_callback"}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
      scope="read:users"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;