import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Help Desk App</h1>
      <div className="home-buttons-container">
        <Link to="/dashboard" className="home-button">
          Get Support
        </Link>
        <Link to="/admin/dashboard" className="home-button">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;