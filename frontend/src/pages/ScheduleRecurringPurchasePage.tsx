import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';


class ScheduleRecurringPurchasePage extends React.Component<any, any> {
  state = {
    data: [],
    loading: true,
    purchasesNotFound: false,
    amount: '',
    purchaseId: '',
    amountEditingMode: false,
    errorMsg: null
  };

  componentDidMount() {
  	this.fetchUserRecurringPurchases()
  }


  onChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  };


  async fetchUserRecurringPurchases() {
  	// SHOULD SECURE THE ROUTE

    const host = process.env.REACT_APP_SERVER_HOST;
    const port = process.env.REACT_APP_SERVER_PORT;

  	const { user, getAccessTokenSilently } = this.props.auth0;

  	let auth0UserId = user['sub'];
  	const url = `http://${host}:${port}/api/trades/coinbase/recurring_purchase/${auth0UserId}`;

  	const token = await getAccessTokenSilently();

  	const reqConfig = {
  	  method: 'GET',
  	  headers: {
  	    Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
  	  }
  	}

    const outerThis = this;

    fetch(url, reqConfig).then(response => {
      response.json().then(data => {
      	console.log("data", data)
      	console.log("data status", data.statusCode)
      	if (data.statusCode === 404) {
          this.setState({
            loading: false,
            purchasesNotFound: true
          });
          return
      	}

        this.setState({
          loading: false,
          purchasesNotFound: false,
          amount: data[0].amount,
          purchaseId: data[0].id
        });
      })
    })
  }

  async savePurchase() {
  	const {amount, purchaseId} = this.state;

  	if (isNaN(+amount)) {
      this.setState({
        errorMsg: "Please enter valid number"
      });
  	  return
  	}

    const host = process.env.REACT_APP_SERVER_HOST;
    const port = process.env.REACT_APP_SERVER_PORT;

  	const { user, getAccessTokenSilently } = this.props.auth0;

  	let auth0UserId = user['sub'];
  	const url = `http://${host}:${port}/api/trades/coinbase/recurring_purchase`;

  	const token = await getAccessTokenSilently();

  	const data = {
  	  amount: amount,
      auth0Id: auth0UserId
  	}

    if (purchaseId) {
      data['id_'] = purchaseId;
    }

  	const reqConfig = {
  	  method: 'POST',
  	  body: JSON.stringify(data),
  	  headers: {
  	    Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
  	  }
  	}

    const outerThis = this;

    fetch(url, reqConfig).then(response => {
      response.json().then(data => {
      	console.log("data", data)

        this.setState({
          loading: false,
          purchasesNotFound: false,
          amount: amount,
          // purchaseId: 
          amountEditingMode: false,
          errorMsg: null
        });
      })
    })
  }

  async deletePurchase() {
    const host = process.env.REACT_APP_SERVER_HOST;
    const port = process.env.REACT_APP_SERVER_PORT;

    const { user, getAccessTokenSilently } = this.props.auth0;

    let auth0UserId = user['sub'];
    const url = `http://${host}:${port}/api/trades/coinbase/recurring_purchase/${auth0UserId}`;

    const token = await getAccessTokenSilently();

    const reqConfig = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }

    const outerThis = this;

    fetch(url, reqConfig).then(response => {
      response.json().then(data => {
        console.log("data", data)

        this.setState({
          amountEditingMode: false,
          amount: '',
          purchaseId: '',
          purchasesNotFound: true
        });
      })
    })
  }

  editPurchase() {
    this.setState({
      amountEditingMode: true
    });
  }


  render() {
    const { data, loading, purchasesNotFound, amountEditingMode, errorMsg } = this.state;

    if (loading) {
      return (
        <p>
      	  Loading..
        </p>
      );
    }

    return (
      <div>
      	{ purchasesNotFound ? (
      	<div>
	      <p>
	      	Recurring purchases not found.
	      </p>
	      <div className="recur-purchases-form__amount-block">
	        <input
	          type="text"
	          className="recur-purchases-form__amount"
	          value={this.state.amount}
	          onChange={this.onChange}
	          name="amount"
	        />
	        <button
	          className="recur-purchases-form__btn"
	          onClick={this.savePurchase.bind(this)}
	        >
	          Add recurring purchase
	        </button>
          </div>

          { errorMsg && (
            <div className="errorMsg">
          	  <span>{ errorMsg }</span>
          	</div>
          )}

		</div>
      	) : (
      	  <div>
	  	    { amountEditingMode ? (
	  	      <>
		      <div className="recur-purchases-form__amount-block">
		        <input
		          type="text"
		          className="recur-purchases-form__amount"
		          value={this.state.amount}
		          onChange={this.onChange}
		          name="amount"
		        />
		        <button
		          onClick={this.savePurchase.bind(this)}
		          className="recur-purchases-form__btn"
		        >
		          Save recurring purchase
		        </button>
	          </div>

	          { errorMsg && (
	            <div className="errorMsg">
	          	  { errorMsg }
	          	</div>
	          )}

	          </>
	  	      ) : (
	  	      <div>
	  	        <div className="recur-purchases-form__amount-block">
	  	      	  <p>
	  	      	    {this.state.amount}$
	  	      	  </p>
	  	        </div>
	  	  	    <div className="recur-purchases-form__buttons">
		          <button
		            onClick={this.editPurchase.bind(this)}
		            className="recur-purchases-form__btn recur-purchases-form__btn-edit"
		          >
		            Edit
		          </button>
		          <button
		            onClick={this.deletePurchase.bind(this)}
		            className="recur-purchases-form__btn recur-purchases-form__btn-delete"
		          >
		            Delete
		          </button>
		        </div>
	      	  </div>
	  	     )}
  	     </div>
      	)}
      </div>
    );
  }
}


export default withAuth0(ScheduleRecurringPurchasePage);