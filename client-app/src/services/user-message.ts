import axios from 'axios';
import { API_URL } from '../config/default';

export const getMessages = async (sessionId: string) => {
  const response = await axios.get(`${API_URL}/api/messages`, {
    headers: {
      'Content-Type': 'application/json',
      'SessionId': `${sessionId}`,
    },
  });
  return response.data;
};

export const sendMessage = async (message: string, sessionId: string) => {
  const response = await axios.post(`${API_URL}/api/user/message`, {message}, {
    headers: {
      'Content-Type': 'application/json',
      'SessionId': `${sessionId}`,
    },
  });
  return response.data;
};

export const sendAdminMessage = async (message: string, sessionId: string, token: string) => {
  const response = await axios.post(`${API_URL}/api/admin/message`, {message}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
      'SessionId': `${sessionId}`,
    },
  });
  return response.data;
};