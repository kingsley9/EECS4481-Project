import { useState, useEffect } from 'react';
import { setCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { verifyToken } from '../../services/jwt';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (verifyToken()) {
      window.location.href = '/admin/dashboard';
    }
  }, []);

  const handleLogin = async () => {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (response.ok) {
      const token = await response.text();
      setCookie('token', token);
      window.location.href = '/admin/dashboard';
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
