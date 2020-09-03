import React from 'react';

import { Table } from 'antd';
import { withAuth0 } from '@auth0/auth0-react';


const columns = [
  {
    title: 'Vendor',
    dataIndex: 'vendor'
  },
  {
    title: 'Username',
    dataIndex: 'username',
  },
  {
    title: 'Max BTC',
    dataIndex: 'maxBtc',
  },
  {
    title: 'Min BTC',
    dataIndex: 'minBtc',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
  },
  {
    title: 'Payment type',
    dataIndex: 'paymentType',
  },
  {
    title: 'Username',
    dataIndex: 'username',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Last online',
    dataIndex: 'lastOnline',
  },
  {
    title: 'Trade count',
    dataIndex: 'tradeCount',
  },
  {
    title: 'Feedback score',
    dataIndex: 'feedbackScore',
  }
];

class LBCTable extends React.Component<any, any> {
  state = {
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
    },
    loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetchTable({ ...pagination });
  }

  handleTableChange = (pagination: any) => {
    this.fetchTable({
      ...pagination
    });
  };

  async fetchTable(params: any = {}) {
    this.setState({ loading: true });
    const host = process.env.REACT_APP_SERVER_HOST;
    const port = process.env.REACT_APP_SERVER_PORT;
    const urlBase = `http://${host}:${port}/api/localbitcoins/get-offers/USD`;
    let url = new URL(urlBase);

    const { getAccessTokenSilently } = this.props.auth0;
    const token = await getAccessTokenSilently();

    const reqConfig = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url.href, reqConfig).then(response => {
      response.json().then(data => {
        this.setState({
          loading: false,
          data: data.results,
          pagination: {
            ...params.pagination,
            total: data.total
          },
        });
      })
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={this.handleTableChange}
      />
    );
  }
}


export default withAuth0(LBCTable);