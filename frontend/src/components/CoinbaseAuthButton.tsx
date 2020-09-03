import React from "react";
import { withAuth0 } from '@auth0/auth0-react';


class CoinbaseAuthButton extends React.Component<any, any> {
  redirect() {
    var uri = this.props.coinbaseAuthClient.code.getUri();
    console.log("redir uri", uri);
    window.location.href = uri; 
  }

  onClick() {
    console.log("Click!");
    console.log("this.props.coinbaseAuthClient", this.props.coinbaseAuthClient)
    if (this.props.coinbaseAuthClient !== undefined) {
      this.redirect();
    }
  }

  render() {
    // const { children } = this.props;
    return (
      <button
        onClick={this.onClick.bind(this)}
        className="btn-link-coinbase"
      >
        Link Coinbase account
      </button>
    );
  }
};

export default withAuth0(CoinbaseAuthButton);
