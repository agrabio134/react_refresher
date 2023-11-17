import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Style/MainLayout.css";
import HomePage from "../pages/HomePage";
// import AboutPage from "../pages/AboutUs";
import ServicePage from "../pages/ServicePage";
import ProfilePage from "../pages/Profile/ProfilePage";
import VerifyEmail from "../Auth/VerifyEmail";
import EmailVerifiedComponent from "../Auth/SuccessMsg";
import AlreadyVerifiedComponent from "../Auth/ErrorVerification";
import BlogPage from "../pages/BlogPage";

const MainLayout = () => {
  return (
    <>
      {/* make a layout for routes */}
      <div className="main_container">
        <Router>
          <div className="main_router">
            <div className="header_logo">Logo</div>
            <div className="main_nav">
              <Link to="/" className="nav_list">
                Home
              </Link>
              <Link to="service" className="nav_list">
                Service
              </Link>
              <Link to="blogs" className="nav_list">
                Blog
              </Link>
              <Link to="profile" className="nav_list">
                Profile
              </Link>
            </div>
          </div>
          <div className="sub_container">
            <div className="main_page">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/email-verified" element={<EmailVerifiedComponent />} />
                <Route path="/already-verified" element={<AlreadyVerifiedComponent />} />
              </Routes>
            </div>
          </div>
        </Router>
        <div className="footer">Footer</div>
      </div>
    </>
  );
};

export default MainLayout;
