// AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import VerifyEmail from '../Auth/VerifyEmail';
import EmailVerifiedComponent from '../Auth/SuccessMsg';
import AlreadyVerifiedComponent from '../Auth/ErrorVerification';
import BlogPage from '../pages/blog/BlogPage';
import AppointmentPage from '../pages/appointment/AppointmentPage';
import GalleryPage from '../pages/gallery/GalleryPage';
import AuthRoutes from '../Auth/AuthRoutes';

const AppRoutes = () => {
  return (<div>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/appointments" element={<AppointmentPage />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/email-verified" element={<EmailVerifiedComponent />} />
      <Route path="/already-verified" element={<AlreadyVerifiedComponent />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
    </Routes>
    </div>
  );
};

export default AppRoutes;
