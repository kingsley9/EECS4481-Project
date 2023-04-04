export const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3100'
    : 'https://help-desk-app-t5.herokuapp.com';
