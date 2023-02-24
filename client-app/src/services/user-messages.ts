import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getCookie } from '../utils/cookie';

export const getMessages = async (sessionId: any) => {
  const response = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response.data;
};

export const sendMessage = async (message: Message, sessionId: any) => {
  const response = await axios.post(`${API_URL}/messages`, message, {
    headers: { Authorization: `Bearer ${getCookie('token')}` },
  });
  return response.data;
};

export interface Message {
  content: string;
  sender: string;
  timestamp: Date;
}