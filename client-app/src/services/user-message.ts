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

export const downloadFile = async (fileId: string, filename: string, sessionId: string, token?: string | null) => {
  try {
    const response = await axios.get(`${API_URL}/api/user/file/${fileId}`, {
      headers: {
        'Content-Type': 'application/json',
        'SessionId': sessionId,
        ...(token && { 'x-access-token': token }),
      },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
    alert('Error downloading file');
  }
};