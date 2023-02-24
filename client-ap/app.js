import axios from 'axios';
import { useState } from 'react';
import './styles/app.css';

function App() {
  const [uuid, setUuid] = useState('');

  const handleAnonymousButtonClick = async () => {
    const response = await axios.get('http://localhost:8080/session');
    const uuid = response.data.uuid;
    document.cookie = `uuid=${uuid}; expires=Session; path=/`;
    setUuid(uuid);
    window.location.href = '/anonymous/dashboard';
  };

  const handleAdminButtonClick = () => {
    // Handle admin user button click
  };

  return (
    <div className="container">
      <h1>Welcome to my website!</h1>
      <div className="buttons">
        <button className="button button-anonymous" onClick={handleAnonymousButtonClick}>
          Anonymous User
        </button>
        <button className="button button-admin" onClick={handleAdminButtonClick}>
          Admin User
        </button>
      </div>
    </div>
  );
}

export default App;
