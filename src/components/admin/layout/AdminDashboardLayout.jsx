// AdminDashboardLayout.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../Styles/AdminLayout.css'; // Import the CSS file

const { Sider, Content } = Layout;

const AdminDashboardLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={130} theme="dark">
        <div className="logo">Admin</div>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']} style={{ marginTop: '16px' }}>
          <Menu.Item key="1" className="menu-item-text">
            <Link to="/admin/users" className="menu-item-link">
              <UserOutlined className="menu-item-icon" />
              Users
            </Link>
          </Menu.Item>
          <Menu.Item key="2" className="menu-item-text">
            <Link to="/admin/statistics" className="menu-item-link">
              <BarChartOutlined className="menu-item-icon" />
              Statistics
            </Link>
          </Menu.Item>
          <Menu.Item key="3" className="menu-item-text">
            <Link to="/admin/calendar" className="menu-item-link">
              <CalendarOutlined className="menu-item-icon" />
              Calendar
            </Link>
          </Menu.Item>
          <Menu.Item key="4" className="menu-item-text">
            <Link to="/admin/documents" className="menu-item-link">
              <FileOutlined className="menu-item-icon" />
              Documents
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '16px', padding: '24px', minHeight: 360, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardLayout;
