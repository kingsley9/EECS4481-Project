import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../../services/jwt';
import { Conversation } from '../../data/conversation';
import { getSessions } from '../../services/sessions';
import axios from 'axios';
import ChatBox from '../../components/chat-box';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const [adminMessage, setAdminMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState(null);

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

            if (response.status === 200 && token) {
              const sessions = await getSessions(token);
              const { message } = response.data;
              setConversations(sessions);
              setAdminMessage(message);
              setSessionId(sessions[0]?.id);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleConversationClick = (sessionId: string) => {
    setSessionId(sessionId);
  };

  return (
    <div style={{ margin: 'auto' }}>
      <h1>Admin Dashboard</h1>
      <p>{adminMessage}</p>
      <button className="logout-button " onClick={handleLogout}>
        Logout
      </button>
      <div className="admin-dashboard">
        <div className="admin-panel">
          <h2 style={{ margin: '15px' }}>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={sessionId === conversation.id ? 'selected' : ''}
              >
                {conversation.id}
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-content">
          <ChatBox sessionId={sessionId} token={token} role="admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
