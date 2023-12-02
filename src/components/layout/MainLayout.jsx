import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Style/MainLayout.css";
import AppRoutes from "./AppRoutes";
import { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook
import jwt_decode from "jwt-decode";
import FooterPage from "./footer/Footer";

const MainLayout = () => {
  const { isLogin, toggleLogin } = useAuth(); // Use the hook to access the global state

  const [sideNavHeight, setSideNavHeight] = useState('0%');
  const [marginTop, setMarginTop] = useState('0%');

  const openNav = () => {
    setSideNavHeight('36%');
    setMarginTop('66%');
  };

  const closeNav = () => {
    setSideNavHeight('0%');
    setMarginTop('0%');
  };

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
              <div className="header_auth_container">
                {/* Conditionally render Profile or Login/Signup based on authentication status */}
                
                {isLogin ? (
                  <Link to="profile" className="auth_item">
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/login" className="auth_item">
                      Login
                    </Link>
                    /
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


      <div id="mySidenav" style={{ height: sideNavHeight}}  className="sidenav">
        
      <div className="main-side-nav-header">
      <div className="side-nav-header_logo">
              <img src="/src/assets/img/logo.png" alt="" />
            </div>
            <div className="side-nab-email">
            <h4>happypaws@example.com</h4>    
            </div>

<div className="top-nav-close-btn">
<button href="javascript:void(0)" className="closebtn" onClick={closeNav}><i className="fa-solid fa-xmark"></i></button>
</div>
            
            </div>


              <div className="side-main_nav">

              <div className="side-nav-content">
                {/* Conditionally render Profile or Login/Signup based on authentication status */}
                <div className="side-nav-home">
                <i class="fa-solid fa-user"></i>
                  </div>
                {isLogin ? (
                  
                  <Link to="profile" className="side-auth_item">
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/login" className="side-auth_item">
                      Login
                    </Link>
                    /
                    <Link to="/auth/signup" className="side-auth_item">
                      Signup
                    </Link>
                  </>
                )}
              </div>
                
                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-house"></i>
                  </div>
                  <Link to="/" className="side-nav_list">
                    Home
                  </Link>
                </div>

                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                  <Link to="/appointments" className="side-nav_list">
                    Appointment
                  </Link>
                </div>

                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-blog"></i>
                  </div>
                  <Link to="blogs" className="sdie-nav_list">
                    Blog
                  </Link>
                </div>

                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <Link to="gallery" className="sdie-nav_list">
                    Gallery
                  </Link>
                </div>
                

            </div>       
        
      </div>

      <button className="sidebar-button"  onClick={openNav}><i className="fa-solid fa-bars"></i></button>


          </div>
          </div>
          <div className="sub_container">
            <div className="main_page" style={{ marginTop }}>
              <AppRoutes />
            </div>
          </div>
        {/* </Router> */}
      </div>
      <FooterPage />
    </>
  );
};

export default MainLayout;
