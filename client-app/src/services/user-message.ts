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

export const sendMessage = async (message: string, sessionId: string, token = '', file?: File | undefined, ) => {
  const formData = new FormData();
  if (file)
    formData.append('file', file);
  const headers: any = {
    'SessionId': sessionId,
    'x-message-content': message,
    'Content-Type': 'multipart/form-data',
  };
  if (token) {
    headers['x-access-token'] = token;
  }
  const response = await axios.post(`${API_URL}/api/user/message`, formData, {
    headers: headers,
  });
  return response.data;
};