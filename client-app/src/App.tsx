import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import './app.css';
import About from './pages/about/about';
import Header from './components/common/header';
import Footer from './components/common/footer';
import Login from './pages/admin/login';
import Dashboard from './pages/dashboard/dashboard';
import AdminDashboard from './pages/admin/admin-dashboard';
import AdminChat from './pages/admin/admin-chat';

function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/chat" element={<AdminChat />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
