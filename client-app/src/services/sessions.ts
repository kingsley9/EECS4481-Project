import axios from 'axios';
import { API_URL } from '../config/default';

export const getSessions = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/admin/sessions`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  });
  return response.data;
};