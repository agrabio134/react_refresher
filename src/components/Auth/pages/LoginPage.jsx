import { useState } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook3.
import Swal from "sweetalert2";
import "../Style/login.css";

const LoginPage = () => {
  const { toggleLogin, isLogin } = useAuth(); // Use the hook to access the global state

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (isLogin) {
    window.location.href = "/";
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    // console.log(formData);

    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseDataText = await response.text();
        console.log("Response Data:", responseDataText);

        const trimmedResponseDataText = responseDataText.replace(/null$/, "");

        try {
          const response2 = JSON.parse(trimmedResponseDataText);
          console.log("Response:", response2);

          const storage = formData.rememberMe ? localStorage : sessionStorage;
          storage.setItem("authToken", response2.payload.token);
          // localStorage.setItem("authToken", response2.payload.token);

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
          console.log("Response Data:", responseDataText);
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

      <section className="login-main-container">   
      <div className="side">
      <img src="/src/assets/img/wc.svg" alt="" />
      </div>
        <div className="main-user-login-container">
        <p className="title">Happy Paws</p>
            <div className="user-separator"></div>
            <p className="welcome-message">Please, provide login credential to proceed and have access to all our services</p>
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
              <i className="fa-solid fa-user"></i>
              </div>
              <div className="user-login-form-control">
              <label htmlFor="password"></label>
              <input
                type="password"
                name="password"
                placeholder="Passsword"
                value={formData.password}
                onChange={handleChange}
                required
              /> 
              <i className="fa-solid fa-lock"></i>
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
   
              <span>remember me</span>

            </div>              
            <input type="submit" value="Login" className="btn1" />
            <a href="#" className="dnthave">Don’t have an account? Sign up</a>
          </form>
          </div>

      </section>
    </>
  );
};

export default LoginPage;
