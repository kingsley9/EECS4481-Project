import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import './app.css';
import About from './pages/about/about';
import Header from './components/common/header';
import Footer from './components/common/footer';
import CookieOptIn from './components/common/cookieOptIn';
import Login from './pages/admin/login';
import Dashboard from './pages/dashboard/dashboard';
import AdminDashboard from './pages/admin/admin-dashboard';

import CookiePrivacy from './pages/privacy/cookie-privacy';

import Cookies from 'js-cookie';
import AdminChat from './pages/admin/admin-chat';
import { API_URL } from './config/default';

function App() {
  const [showBanner, setShowBanner] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response: any = await fetch(`${API_URL}/api/csrf-token`);

        const data = await response.json();
        setCsrfToken(data.csrfToken);
        Cookies.set('XSRF-TOKEN', data.csrfToken); // Store the CSRF token as a cookie
      } catch (error: any) {
        console.log(error.message);
        console.error('Error fetching CSRF token:', error.message);
      }
    }

    fetchCsrfToken();
  }, []);
  useEffect(() => {
    const hasAllowedCookies = Cookies.get('allowCookies') === 'true';
    if (!hasAllowedCookies) {
      setShowBanner(true);
    }
  }, []);

  const handleAllowCookies = () => {
    Cookies.set('allowCookies', 'true', { expires: 365 });
    setShowBanner(false);
  };

  const handleDeclineCookies = () => {
    Cookies.set('allowCookies', 'false', { expires: 365 });
    setShowBanner(false);
    // Do something else here if the user declines cookies
  };
  const basename =
    process.env.NODE_ENV === 'production' ? '/EECS4481-Project-T5' : '';

  return (
    <Router basename={basename}>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />

          {!showBanner && <Route path="/dashboard" element={<Dashboard />} />}
          <Route path="/about" element={<About />} />

          <Route path="/privacy/cookie" element={<CookiePrivacy />} />

          {!showBanner && <Route path="/admin/login" element={<Login />} />}
          {!showBanner && (
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          )}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/chat" element={<AdminChat />} />
        </Routes>
      </div>

      <CookieOptIn
        showBanner={showBanner}
        handleAllowCookies={handleAllowCookies}
        handleDeclineCookies={handleDeclineCookies}
      />
      <Footer />
    </Router>
  );
}

export default App;
