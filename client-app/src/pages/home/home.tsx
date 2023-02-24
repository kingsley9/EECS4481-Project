import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie, getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import axios from 'axios';
import './home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sessionCookie = getCookie('session');

  const handleGetSupport = async () => {
    if (sessionCookie) {
      navigate('/dashboard');
    } else {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/session`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = response.data;
        setCookie('session', data.sessionId);
        setLoading(false);
        navigate('/dashboard');
      } catch (error) {
        console.error(error);
        setLoading(false);
        alert('An error occurred while creating a session.');
      }
    }
  };

  return (
    <div className="home-container">
      <h1>Help Desk App</h1>
      <div className="home-buttons-container">
        <button className="home-button" onClick={handleGetSupport} disabled={loading}>
          {sessionCookie ? 'Continue Chat' : 'Get Support'}
        </button>
        <Link to="/admin/dashboard" className="home-button">
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
