import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  UserOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FileOutlined,
  LogoutOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "../styles/AdminLayout.css"; // Import the CSS file

const { Sider, Content } = Layout;

const AdminDashboardLayout = ({ children }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

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
    });
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  useEffect(() => {
    // Hide the Drawer on the first load
    setDrawerVisible(false);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider for larger screens */}
      <Sider  className="sider"
        width={150}
        // theme="dark"
        collapsedWidth={0}
        breakpoint="md"
        onBreakpoint={toggleDrawer}
      >
        <div className="logo" onClick={toggleDrawer}>
          <img src="/page/NLHD.png" alt="" />
        </div>
        <Menu className="menu" mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" className="menu-item-text">
            <Link to="/admin/" className="menu-item-link">
              <BarChartOutlined className="menu-item-icon" />
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="4" className="menu-item-text">
            <Link to="/admin/records" className="menu-item-link">
              <HistoryOutlined className="menu-item-icon" />
              Records
            </Link>
          </Menu.Item>
          <Menu.Item key="3" className="menu-item-text">
            <Link to="/admin/calendar" className="menu-item-link">
              <CalendarOutlined className="menu-item-icon" />
              Calendar
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

      {/* Drawer for mobile view */}
      <Drawer
        title="Admin"
        placement="left"
        closable={true}
        onClose={toggleDrawer}
        visible={drawerVisible}
      >
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" className="menu-item-text">
            <Link to="/admin/" className="menu-item-link">
              <BarChartOutlined className="menu-item-icon" />
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="4" className="menu-item-text">
            <Link to="/admin/records" className="menu-item-link">
              <HistoryOutlined className="menu-item-icon" />
              Records
            </Link>
          </Menu.Item>
          <Menu.Item key="3" className="menu-item-text">
            <Link to="/admin/calendar" className="menu-item-link">
              <CalendarOutlined className="menu-item-icon" />
              Calendar
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
      </Drawer>

      <Layout className="site-layout">
        <Content
          style={{
            margin: "16px",
            padding: "0",
            minHeight: 360,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardLayout;
