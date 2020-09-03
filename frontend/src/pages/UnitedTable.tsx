import React from 'react';

/*
type MyProps = {
  // using `interface` is also ok
  message: string;
};
type MyState = {
  count: number; // like this
};
export class LBCTable extends React.Component<MyProps, MyState> {
  state: MyState = {
    // optional second annotation for better type inference
    count: 0,
  };
  render() {
    return (
      <div>
        test
        {this.props.message} {this.state.count}
      </div>
    );
  }
}
*/


import { Table } from 'antd';


const columns = [
  {
    title: 'Vendor',
    dataIndex: 'vendor'
  },
  {
    title: 'Max BTC',
    dataIndex: 'max_btc',
  },
  {
    title: 'Min BTC',
    dataIndex: 'min_btc',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
  {
    title: 'Payment type',
    dataIndex: 'payment_type',
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
  }
];

export class UnitedTable extends React.Component {
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

  fetchTable = (params: any = {}) => {
    this.setState({ loading: true });
    const host = process.env.REACT_APP_SERVER_HOST;
    const port = process.env.REACT_APP_SERVER_PORT;
    console.log('host', host)
    console.log('port', port)
    const urlBase = `http://${host}:${port}/api/views/get-united-table`;
    let url = new URL(urlBase);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url.href, {
      method: 'GET'
    }).then(response => {
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

