import React from 'react';
import './App.css';
import { createBrowserHistory } from 'history';
import { Layout } from 'antd';
import DefaultLayout from './components/DefaultLayout';
import { withAuth0 } from '@auth0/auth0-react';


export const history = createBrowserHistory();


export class App extends React.Component<any, {}> {

  render() {
    return (
    <Layout>
      <DefaultLayout/>
    </Layout>
    );
  }
}

export default withAuth0(App);


