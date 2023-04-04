import axios from 'axios';
import { API_URL } from '../config/default';

export const getAdmins = async (token?: string | null) => {
  const response = await axios.get(`${API_URL}/api/admin/list`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-access-token': token }),
    },
  });
  return response.data;
};