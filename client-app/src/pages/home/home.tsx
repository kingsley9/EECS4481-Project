import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUserTie } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Help Desk App</h1>
      <div className="home-buttons-container">
        <Link to="/dashboard" className="home-button">
          <FontAwesomeIcon icon={faComments} size="3x" />
          Get Support
        </Link>
        <Link to="/admin/dashboard" className="home-button">
          <FontAwesomeIcon icon={faUserTie} size="3x" />
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
