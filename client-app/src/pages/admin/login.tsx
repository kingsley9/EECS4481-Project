import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { verifyToken } from '../../services/jwt';
import axios from 'axios';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const token = getCookie('token');

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken(token);
      if (isValid) {
        navigate('/admin/dashboard');
      }
    };
    checkToken();
  }, [token, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        const { token } = response.data;
        setCookie('token', token);
        navigate('/admin/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while logging in.');
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <div className="login-form">
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
