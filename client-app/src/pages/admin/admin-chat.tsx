import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../../services/jwt';
import { Admin } from '../../data/admin';
import { getAdmins } from '../../services/admin';
import axios from 'axios';
import AdminChatBox from '../../components/chat-box-admin';
import './admin-chat.css';

const AdminChat = () => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const [adminMessage, setAdminMessage] = useState('');
  const [conversations, setConversations] = useState<Admin[]>([]);
  const [adminId, setAdminId] = useState<number | null>(null);

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
                'x-access-token': token,
              },
            });

            if (response.status === 200 && token) {
              const admins = await getAdmins(token);
              console.log(admins);
              const { message } = response.data;
              setConversations(admins);
              setAdminMessage(message);
              setAdminId(admins[0]?.adminid || null);
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

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleConversationClick = (adminId: number) => {
    setAdminId(adminId);
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
                key={conversation.adminid}
                onClick={() => handleConversationClick(conversation.adminid)}
                className={adminId === conversation.adminid ? 'selected' : ''}
              >
                {conversation.username}
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-content">
          {adminId ? (
            <AdminChatBox adminId={adminId} token={token} role="user" />
          ) : (
            <p>No active conversations</p>
          )}
        </div>
      </div>
      <button className="admin-chat-button " onClick={handleAdminDashboard}>
        Admin Dashboard
      </button>
    </div>
  );
};

export default AdminChat;
