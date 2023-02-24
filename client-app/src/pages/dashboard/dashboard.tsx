import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../../components/chat-box';

const Dashboard = () => {
  const navigate = useNavigate();

  const sessionId = getCookie('session') ?? '';

  useEffect(() => {
    if (!sessionId || sessionId === '') {
      navigate('/');
    }
  }, [navigate, sessionId]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard!</p>
      <div className="chat-area">
        <ChatBox sessionId={sessionId} />
      </div>
    </div>
  );
};

export default Dashboard;
