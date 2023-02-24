import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../../services/jwt'; // import logout from jwt service
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const [adminMessage, setAdminMessage] = useState('');

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
                'Authorization': `JWT ${token}`,
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
    <div>
      <h1>Admin Dashboard</h1>
      <p>{adminMessage}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
