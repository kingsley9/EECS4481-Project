import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../utils/constants";
import { useNavigate as navigate } from 'react-router-dom';
import Cookies, { CookieAttributes } from 'js-cookie';

const expires = new Date(Date.now() + 3600 * 1000); // expires in 1 hour
const options: CookieAttributes = { expires, secure: true, httpOnly: true };

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const response = await axios.post(`${API_URL}/admin/login`, {
      username,
      password
    });
  
    const { token } = response.data;
  
    Cookies.set('token', token, options);
    navigate();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
