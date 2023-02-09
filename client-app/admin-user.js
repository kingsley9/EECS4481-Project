const axios = require('axios');
const base64 = require('base64-arraybuffer');

const getSessions = async () => {
  const auth = base64.encode(`admin:password`);
  const response = await axios.get(`http://localhost:8080/sessions`, { headers: { Authorization: `Basic ${auth}` } });
  console.log(`Active sessions:`);
  console.log(response.data);
  return response.data;
};

const getMessages = async (sessionId) => {
  const auth = base64.encode(`admin:password`);
  const response = await axios.get(`http://localhost:8080/messages?sessionId=${sessionId}`, { headers: { Authorization: `Basic ${auth}` } });
  console.log(`Received messages:`);
  console.log(response.data);
};

(async () => {
  const sessions = await getSessions();
  console.log(`Session IDs: ${sessions.map(session => session.id).join(', ')}`);
  const sessionId = process.argv[2];
  if (!sessionId) {
    console.error('Please specify session ID as the first argument');
    process.exit(1);
  }
  getMessages(sessionId);
})();
