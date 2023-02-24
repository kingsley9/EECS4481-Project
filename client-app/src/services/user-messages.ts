import axios from 'axios';
import { API_URL } from '../config/default';
import { getCookie } from '../utils/cookie';

export const getMessages = async (sessionId: string) => {
  const response = await axios.get(`${API_URL}/api/user/messages`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: { 'sessionId': sessionId }
  });
  return response.data;
};

export const sendMessage = async (message: string, sessionId: string) => {
  const response = await axios.post(`${API_URL}/api/user/message`, {message: message, sessionId: sessionId}, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export interface Message {
  content: string;
  sender: string;
  timestamp: Date;
}