import { removeCookie } from '../utils/cookie';
import { API_URL } from '../config/default';
import axios from 'axios';

export const verifyToken = async (token = ''): Promise<boolean> => {
  if (token === '') return false;

  try {
    const response = await axios.get(`${API_URL}/api/admin/verify`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
    });

    if (response.status === 200) {
      const { isValid } = response.data;
      return isValid;
    } else {
      removeCookie('token');
      return false;
    }
  } catch (err) {
    console.error(err);
    removeCookie('token');
    return false;
  }
};

export const logout = () => {
    removeCookie('token');
};
