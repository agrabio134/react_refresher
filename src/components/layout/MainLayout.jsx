import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Style/MainLayout.css";
import AppRoutes from "./AppRoutes";
import { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook
import jwt_decode from "jwt-decode";

const MainLayout = () => {
  const { isLogin, toggleLogin } = useAuth(); // Use the hook to access the global state

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      const decodedToken = jwt_decode(storedToken);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        toggleLogin(false); // Update the global state to indicate logout
      } else {
        toggleLogin(true); // Update the global state
      }
    }
  }, []);

  return (
    <>
      <div className="main_container">
        {/* <Router> */}
          <div className="header_fixed">
          <div className="top_header_section">
              <div className="email_container">
                <i className="fa-solid fa-envelope"></i>
                <h6>happypaws@example.com</h6> 
              </div>

          <div className="auth_content">
              <div className="icon">
              <i className="fa-brands fa-square-facebook"></i>
              <i className="fa-brands fa-x-twitter"></i>
              <i className="fa-brands fa-instagram"></i>
           </div>
              <div className="auth_container">
                {/* Conditionally render Profile or Login/Signup based on authentication status */}
                
                {isLogin ? (
                  <Link to="profile" className="auth_item">
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/login" className="auth_item">
                      Login/
                    </Link>
                    
                    <Link to="/auth/signup" className="auth_item">
                      Signup
                    </Link>
                  </>
                )}
              </div>
          </div>             
      </div>
          <div className="main_router">
            <div className="header_logo">
              <img src="/src/assets/img/logo.png" alt="" />
            </div>
            <div className="main_nav">
              <Link to="/" className="nav_list">
                Home
              </Link>
              <Link to="/appointments" className="nav_list">
                Appointment
              </Link>
              <Link to="blogs" className="nav_list">
                Blog
              </Link>
              <Link to="gallery" className="nav_list">
                Gallery
              </Link>
            </div>
          </div>
          </div>
          <div className="sub_container">
            <div className="main_page">
              <AppRoutes />
            </div>
          </div>
        {/* </Router> */}
        <div className="footer">Footer</div>
      </div>
    </>
  );
};

export default MainLayout;
