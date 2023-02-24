import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../../services/jwt';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const [adminMessage, setAdminMessage] = useState('');

  useEffect(() => {
    if (!verifyToken(token)) {
      navigate('/admin/login');
    } else {
      const fetchAdminMessage = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/admin`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
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
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>{adminMessage}</p>
    </div>
  );
};

export default AdminDashboard;
