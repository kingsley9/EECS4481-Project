import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import './app.css'
import About from './pages/about/about';
import Header from './components/common/header';
import Footer from './components/common/footer';
import Login from './pages/admin/login';

function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<Login />}  />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;