import { useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const sessionCookie = getCookie('session');

    if (!sessionCookie) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard!</p>
    </div>
  );
};

export default Dashboard;
