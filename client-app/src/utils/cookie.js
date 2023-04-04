import Cookies from 'js-cookie';

export const setCookie = (name, value) => {
  Cookies.set(name, value, {
    secure: false,
    httpOnly: false,
    sameSite: 'Strict',
  });
};

export const getCookie = (name) => {
  return Cookies.get(name) || '';
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};