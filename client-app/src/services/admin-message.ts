// admin-message.ts
import axios from 'axios';
import { API_URL } from '../config/default';

export const getAdminMessages = async (token: string, adminId: number) => {
  const response = await axios.get(`${API_URL}/api/admin/messages/${adminId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });
  return response.data;
};

export const sendAdminMessage = async (message: string, token: string, adminId: number, file?: File | undefined) => {
  const formData = new FormData();
  if (file)
    formData.append('file', file);
  const headers: any = {
    'x-access-token': token,
    'x-message-content': message,
  };
  const response = await axios.post(`${API_URL}/api/admin/message/${adminId}`, formData, {
    headers: headers,
  });
  return response.data;
};

export const downloadAdminFile = async (fileId: string, filename: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/file/${fileId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
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
