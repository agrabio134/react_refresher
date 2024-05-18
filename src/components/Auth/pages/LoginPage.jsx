import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import "../Style/login.css";
import PhoneLogin from "./PhoneLogin";
import ForgotPassword from "./ForgotPassword";
import { Modal, Button } from "antd";

const LoginPage = () => {
  const { toggleLogin } = useAuth();
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);


  const handlePhoneLogin = (token) => {
    const storage = formData.rememberMe ? localStorage : sessionStorage;
    storage.setItem("authToken", token);
    toggleLogin();
  };


  const handleForgotPasswordClick = () => {
    setForgotPasswordVisible(true);
  };

  const handleForgotPasswordCancel = () => {
    setForgotPasswordVisible(false);
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://happypawsolongapo.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseDataText = await response.text();
        const trimmedResponseDataText = responseDataText.replace(/null$/, "");

        try {
          const response2 = JSON.parse(trimmedResponseDataText);
          const storage = formData.rememberMe ? localStorage : sessionStorage;
          storage.setItem("authToken", response2.payload.token);

          toggleLogin();

          Swal.fire({
            title: "Login successful",
            icon: "success",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        } catch (error) {
          console.error("An error occurred while parsing JSON:", error);
        }
      } else {
        let responseDataText;
        try {
          responseDataText = await response.text();
          // console.log("Response Data:", responseDataText);
        } catch (error) {
          console.error(
            "An error occurred while reading the response text:",
            error
          );
          return;
        }

        if (response.status === 403) {
          Swal.fire({
            title: "Login failed",
            icon: "error",
            text: "Email not verified. Please verify your email first.",
            confirmButtonText: "Okay",
          });
        } else {
          Swal.fire({
            title: "Login failed",
            icon: "error",
            text: "Invalid email or password",
            confirmButtonText: "Okay",
          });
        }
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <>
      <section id="login">
        <div className="container">
          <div className="main-login-container">
            <div className="login-logo-container">
              <img src="/page/NLHD.png" alt="" />
              <h1>Paws Pro</h1>
            </div>

            <div className="main-user-login-container">
              <h2>Welcome!</h2>
              <div class="bar"></div>
              <p className="mobile-none">
                Please provide login credential to proceed and have access to
                all our services
              </p>

                <div className="radio-select">
                  <input
                    type="radio"
                    id="email"
                    name="login"
                    value="email"
                    checked={!isPhoneLogin}
                    onChange={() => setIsPhoneLogin(false)}
                  />
                  <label htmlFor="email"> Email</label>
                  <input
                    type="radio"
                    id="phone"
                    name="login"
                    value="phone"
                    checked={isPhoneLogin}
                    onChange={() => setIsPhoneLogin(true)}
                  />
                  <label htmlFor="phone">Phone</label>
                </div>
                <div className="scrollable-container">
                {isPhoneLogin === false && (
                  <form className="user-login-box" onSubmit={handleLoginSubmit}>
                    <div className="user-login-form-control">
                      <label htmlFor="email"></label>
                      <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <i className="fa-solid fa-user fa-sm"></i>
                    </div>
                    <div className="user-login-form-control">
                      <label htmlFor="password"></label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <i className="fa-solid fa-lock fa-sm"></i>
                    </div>
                    <div className="user-login-form-control rm">
                      <label className="user-check-box">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span>Remember Me</span>
                    </div>
                    <input type="submit" value="Login" className="btn1" />
                    <p
                      className="forgot-password-text"
                      onClick={handleForgotPasswordClick}
                    >
                      Forgot Password?
                    </p>
                    <p>
                      Don’t have an account?
                      <a href="/auth/signup" className="dnthave">
                        {" "}
                        Sign up
                      </a>
                    </p>

                    <Modal
                      title="Forgot Password"
                      visible={forgotPasswordVisible}
                      onCancel={handleForgotPasswordCancel}
                      footer={null}
                    >
                      <ForgotPassword />
                    </Modal>
                    {/* Forgot Password Text */}
                  </form>
                )}
                {isPhoneLogin === true && (
                  <PhoneLogin onPhoneLogin={handlePhoneLogin} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="default-shape">
          <div className="shape-1">
            <img src="/page/paws.png" width="100px" height="auto" alt="" />
          </div>

          <div className="shape-2 rotateme">
            <img src="/page/dog-toy-1.png" width="100px" height="auto" alt="" />
          </div>

          <div className="shape-3">
            <img src="/page/groom-1.png" width="70px" height="auto" alt="" />
          </div>

          <div className="shape-4">
            <img src="/page/cat-toy.png" width="60px" height="auto" alt="" />
          </div>

          <div className="shape-5">
            <img src="/page/medicine.png" width="75px" height="auto" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
