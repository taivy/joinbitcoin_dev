import React from 'react';
import { Layout, Menu } from 'antd';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import { UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import { NavLink, withRouter } from 'react-router-dom';

const { Sider } = Layout;


const SiderMenu = (props:any) => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="logo" />
      <Menu theme="dark" 
            mode="inline"
            defaultSelectedKeys={['/']}
            activeKey={location.pathname}
            selectedKeys={[location.pathname]}
      >
        <Menu.Item key="/" icon={<UserOutlined />}>
          <span>main</span>
          <NavLink to="/" />
        </Menu.Item>
        {isAuthenticated ? (
          <Menu.Item key="/logout">
            <LogoutButton />
          </Menu.Item>
        ): (
          <Menu.Item key="/login">
            <LoginButton />
          </Menu.Item>
        )}
        {isAuthenticated && (
          <Menu.Item key="/balances" icon={<UserOutlined />}>
            <span>Balances</span>
            <NavLink to="/balances" />
          </Menu.Item>
        )}
        {isAuthenticated && (
          <Menu.Item key="/schedule_recurring_purchase" icon={<UserOutlined />}>
            <span>Schedule recurring purchase</span>
            <NavLink to="/schedule_recurring_purchase" />
          </Menu.Item>
        )}
        <Menu.Item key="/buy-bitcoin" icon={<UserOutlined />}>
          <span>buy-bitcoin</span>
          <NavLink to="/buy-bitcoin" />
        </Menu.Item>
        <Menu.Item key="/united-view" icon={<UserOutlined />}>
          <span>united-view</span>
          <NavLink to="/united-view" />
        </Menu.Item>
      </Menu>

    </Sider>
  )
}



export default withRouter(SiderMenu);

