import React from 'react';
import { AuthProvider } from './components/Auth/AuthContext';
import MainLayout from './components/layout/MainLayout';
import BackOfficePage from './components/admin/BackOffice';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const isBackOffice = window.location.pathname.startsWith('/backoffice');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {isBackOffice ? (
            <Route path="/backoffice/*" element={<BackOfficePage />} />
          ) : (
            <Route path="/*" element={<MainLayout />} />
          )}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
