import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/chat-box';
import './dashboard.css';
const Dashboard = () => {
  const navigate = useNavigate();

  const sessionId = getCookie('session') ?? '';

  useEffect(() => {
    if (!sessionId || sessionId === '') {
      navigate('/');
    }
  }, [navigate, sessionId]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard!</p>

      <ChatBox sessionId={sessionId} role="user" />
    </div>
  );
};

export default Dashboard;
