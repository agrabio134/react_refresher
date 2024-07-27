import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Style/MainLayout.css";
import AppRoutes from "./AppRoutes";
import { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext"; // Import the useAuth hook
import jwt_decode from "jwt-decode";
import FooterPage from "./footer/Footer";
import axios from "axios";

const MainLayout = () => {
  const { isLogin, toggleLogin } = useAuth(); // Use the hook to access the global state

  const [sideNavHeight, setSideNavHeight] = useState('0%');
  const [marginTop, setMarginTop] = useState('0%');
  const [user, setUser] = useState({}); // Initialize the user state with an empty object
  const [storedToken, setStoredToken] = useState(localStorage.getItem("authToken"));
  const [userFName, setUserFName] = useState("");

  // get user 
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      const decodedToken = jwt_decode(storedToken);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        toggleLogin(false); // Update the global state to indicate logout
      } else {
        toggleLogin(true); // Update the global state
        setUser(decodedToken);
      }
    }
  }, [storedToken]);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (storedToken) {
      const decodedToken = jwt_decode(storedToken);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        toggleLogin(false);
      } else {
        toggleLogin(true);

        axios
          .get(`https://happypawsolongapo.com/api/getuser/${decodedToken.user_id}`)
          .then((res) => {
            const result = res.data;

            const jsonObjects = result.split("}{");
            jsonObjects[0] = jsonObjects[0] + "}";
            jsonObjects[1] = "{" + jsonObjects[1];
            const jsonObject1 = JSON.parse(jsonObjects[0]);

            const fName = jsonObject1.payload[0].fname;

            setUserFName(fName);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [storedToken]);

  const openNav = () => {
    setSideNavHeight('auto');
    setMarginTop('13%');
  };

  const closeNav = () => {
    setSideNavHeight('0%');
    setMarginTop('0%');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.querySelector('.header-main_container').classList.add('is-sticky');
      } else {
        document.querySelector('.header-main_container').classList.remove('is-sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <header className="header-main_container">
        <div className="header-main-box-container">
          {/* <Router> */}
            <div className="header_logo">
              <img src="/page/VatanL.png" alt="" />
              <h1>PawsPro</h1>
            </div>
              
            <div className="main_nav">

              <Link to="/" className="nav_list">
                Home
              </Link>

              <Link to="/appointments" className="nav_list">
                Appointment
              </Link>

              <Link to="gallery" className="nav_list">
                Gallery
              </Link>

              <Link to="blogs" className="nav_list">
                Promos
              </Link> 
              
              <div className="auth-main-container">
              {/* Conditionally render Profile or Login/Signup based on authentication status */}
                
            {isLogin ? (
              
                <Link to="profile" className="auth_item">
                  Welcome, {userFName}
                </Link>

              ) : (
              <>
                <Link to="/auth/login" className="auth_item" >
                  Login
                </Link>
                /
                <Link to="/auth/signup" className="auth_item">
                  Signup
                </Link>
              </>
              )
              }
              <span></span>
              </div>
            </div>

      <div id="mySidenav" style={{ height: sideNavHeight}}  className="sidenav">
        
      <div className="main-side-nav-header">
      <div className="side-nav-header_logo">
      <img src="/page/VatanL.png" alt="" />
              <h1>PawsPro</h1>
            </div>

<div className="top-nav-close-btn">
  <button href="" className="closebtn" onClick={closeNav}><i className="fa-solid fa-xmark"></i></button>
</div>
            
            </div>


              <div className="side-main_nav">

              <div className="side-nav-content">
                {/* Conditionally render Profile or Login/Signup based on authentication status */}
                <div className="side-nav-home">
                <i className="fa-solid fa-user"></i>
                  </div>
                {isLogin ? (
                  
                  <Link to="profile" className="side-auth_item" onClick={closeNav}>
                    Welcome, {userFName}
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/login" className="side-auth_item" onClick={closeNav}>
                      Login
                    </Link>
                    /
                    <Link to="/auth/signup" className="side-auth_item"  onClick={closeNav}>
                      Signup
                    </Link>
                  </>
                )}
              </div>
                
                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-house"></i>
                  </div>
                  <Link to="/" className="side-nav_list" onClick={closeNav}>
                    Home
                  </Link>
                </div>

                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                  <Link to="/appointments" className="side-nav_list" onClick={closeNav}>
                    Appointment
                  </Link>
                </div>

                <div className="side-nav-content">
                  <div className="side-nav-home">
                  <i className="fa-solid fa-newspaper"></i>  
                                  </div>
                  <Link to="blogs" className="sdie-nav_list" onClick={closeNav}>
                    Promo
                  </Link>
                </div>

                <div className="side-nav-content">
                  <div className="side-nav-home">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <Link to="gallery" className="sdie-nav_list" onClick={closeNav}>
                    Gallery
                  </Link>
                </div>
                

            </div>       
        
      </div>

      <button className="sidebar-button"  onClick={openNav}><i className="fa-solid fa-bars"></i></button>


        {/* </Router> */}
        
        </div>
      </header>
      {/* <div className="sub_container">
            <div className="main_page" style={{ marginTop }}>
              <AppRoutes />
            </div>
          </div> */}
      <AppRoutes />
      <FooterPage />
    </>
  );
};

export default MainLayout;
