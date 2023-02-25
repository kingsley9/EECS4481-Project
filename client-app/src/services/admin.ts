import axios from 'axios';
import { API_URL } from '../config/default';

export const getAdmins = async (token = '') => {
  const response = await axios.get(`${API_URL}/api/admin/list`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
  return response.data;
};