import axios from 'axios';
import { API_URL } from '../config/default';

export const getSessions = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/admin/sessions`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-access-token': token }),
    },
  });
  return response.data;
};

export const updateSessionAdmin = async (sessionId: string, adminId: string, token = '') => {
  const response = await axios.patch(`${API_URL}/api/user/update`, {sessionId, adminId}, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-access-token': token }),
    },
  });
  return response.data;
};