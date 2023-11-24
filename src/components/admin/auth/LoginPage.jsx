// LoginPage.js
import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./LoginPage.css"; // Import your custom CSS file

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [blurBackground, setBlurBackground] = useState(false);

  const handleLogin = (values) => {
    // Add your login logic here
    console.log("Received values:", values);
  };

  const activateBlur = () => {
    setBlurBackground(true);
  };

  return (
    <div className="Main-container">
    <div className={`login-container ${blurBackground ? 'blur-background' : ''}`}>
      <div className="login-content">
        <Title level={2} className="login-header">
          Welcome to Happy Paws Admin Portal
        </Title>
        <Paragraph className="login-subtext">Please log in to access the admin features.</Paragraph>

        <Form form={form} onFinish={handleLogin} className="login-form" onClick={activateBlur}>
        <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="login-links">
          <a href="/admin/forgot-password" className="forgot-password-link">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
