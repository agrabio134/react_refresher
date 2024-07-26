// LoginPage.js
import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "./LoginPage.css";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthContext"; // Import your AdminAuthContext

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const { isAdminLogin, handleAdminLogin } = useAdminAuth(); // Use the admin authentication context

  const [form] = Form.useForm();
  const [blurBackground, setBlurBackground] = useState(false);

  // if there is token and admin, show admin dashboard
  if (localStorage.getItem("adminAuthToken") && isAdminLogin) {
    window.location.href = "/admin/";
    // add s
  }

  const handleLogin = async (values) => {
    event.preventDefault();
    // console.log(formData);
    console.log(values);

    try {
      const response = await fetch("https://happypawsolongapo.com/api/admin_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseDataText = await response.text();
        console.log("Response Data:", responseDataText);

        const trimmedResponseDataText = responseDataText.replace(/null$/, "");

        try {
          const response2 = JSON.parse(trimmedResponseDataText);
          console.log("Response:", response2);

          // Assuming the response contains a token for admin login
          handleAdminLogin(response2.payload.token);

          Swal.fire({
            title: "Login successful",
            icon: "success",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/admin/";
            }
          });
        } catch (error) {
          console.error("An error occurred while parsing JSON:", error);
        }
      } else {
        let responseDataText;
        try {
          responseDataText = await response.text();
          console.log("Response Data:", responseDataText);
        } catch (error) {
          console.error("An error occurred while reading the response text:", error);
          return;
        }

        Swal.fire({
          title: "Login failed",
          text: "Please check your username and password",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const activateBlur = () => {
    setBlurBackground(true);
  };

  return (
    <AdminAuthProvider> {/* Wrap your component with the AdminAuthProvider */}
      <div className="Main-container">
        <div className={`login-container ${blurBackground ? 'blur-background' : ''}`}>
          <div className="login-content">
            <Title level={2} className="login-header">
              Welcome to Vatan Animal Hospital Admin Portal
            </Title>
            <Paragraph className="login-subtext">Please log in to access the admin features.</Paragraph>

            <Form form={form} onFinish={handleLogin} className="login-form" onClick={activateBlur}>
              <Form.Item
                name="email"
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
              {/* <a href="/admin/forgot-password" className="forgot-password-link">
                Forgot Password?
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </AdminAuthProvider>
  );
};

export default LoginPage;
