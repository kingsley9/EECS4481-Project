import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../../services/jwt'; // import logout from jwt service
import axios from 'axios';
import ChatBox from '../../components/chat-box';
import './admin-dashboard.css';
const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const [adminMessage, setAdminMessage] = useState('');
  const [conversations, setConversations] = useState([
    { id: 2, name: 'user12134' },
    { id: 3, name: 'user12244' },
    { id: 4, name: 'user12264' },
  ]);

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken(token);
      if (!isValid) {
        navigate('/admin/login');
      } else {
        const fetchAdminMessage = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/admin`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`,
              },
            });

            if (response.status === 200) {
              const { message } = response.data;
              setAdminMessage(message);
            } else {
              alert('Server Error!');
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred while fetching admin message.');
          }
        };

        fetchAdminMessage();
      }
    };
    checkToken();
  }, [token, navigate]);

  // add a logout function to handle logout button click
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ margin: 'auto' }}>
      <h1>Admin Dashboard</h1>
      <p>{adminMessage}</p>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="admin-dashboard">
        <div className="admin-panel">
          <h2 style={{ margin: '15px' }}>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation.id}>{conversation.name}</li>
            ))}
          </ul>
        </div>
        <div className="admin-content">
          <ChatBox sessionId="token" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
