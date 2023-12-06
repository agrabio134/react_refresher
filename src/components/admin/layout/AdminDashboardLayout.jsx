// AdminDashboardLayout.jsx
import React from 'react';
import { Layout, Menu, Button  } from 'antd';
import {
  UserOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FileOutlined,
  LogoutOutlined,
  HistoryOutlined   
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import '../Styles/AdminLayout.css'; // Import the CSS file

const { Sider, Content } = Layout;

const AdminDashboardLayout = ({ children }) => {
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
    localStorage.removeItem("adminAuthToken");
    window.location.href = "/admin/login";
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
      
    }
    );
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={130} theme="dark">
        <div className="logo">Admin</div>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']} style={{ marginTop: '16px' }}>

        <Menu.Item key="1" className="menu-item-text">
            <Link to="/admin/" className="menu-item-link">
              <BarChartOutlined className="menu-item-icon" />
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="2" className="menu-item-text">
            <Link to="/admin/users" className="menu-item-link">
              <UserOutlined className="menu-item-icon" />
              Users
            </Link>
          </Menu.Item>
          <Menu.Item key="3" className="menu-item-text">
            <Link to="/admin/calendar" className="menu-item-link">
              <CalendarOutlined className="menu-item-icon" />
              Calendar
            </Link>
          </Menu.Item>
          <Menu.Item key="4" className="menu-item-text">
            <Link to="/admin/records" className="menu-item-link">
              <HistoryOutlined   className="menu-item-icon" />
              Records
            </Link>
          </Menu.Item>

          <Menu.Item key="5" className="menu-item-text">
            <Link to="/admin/content" className="menu-item-link">
              <FileOutlined className="menu-item-icon" />
              Content
            </Link>
          </Menu.Item>
          <Menu.Item key="6" className="menu-item-logout">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </Button>
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
