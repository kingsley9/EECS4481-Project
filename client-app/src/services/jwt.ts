import jwt_decode from 'jwt-decode';
import { getCookie, removeCookie } from '../utils/cookie';

interface DecodedToken {
  admin: boolean;
  exp: number;
}

export const verifyToken = (): boolean => {
  const token = getCookie('token');
  if (!token) return false;

  try {
    const decoded = jwt_decode<DecodedToken>(token);
    if (decoded.admin && decoded.exp * 1000 > Date.now()) {
      return true;
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