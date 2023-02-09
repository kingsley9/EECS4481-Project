const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const basicAuth = require('basic-auth');
const { Pool } = require('pg');
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

const pool = new Pool({
  user: 'dbadmin',
  host: 'localhost',
  database: 'messaging_app',
  password: 'password',
  port: 5432,
});

const sessions = new Map();

const auth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== 'admin' || user.pass !== 'password') {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.sendStatus(401);
    return;
  }
  next();
};

app.use(bodyParser.json());

app.post('/session', async (req, res) => {
  const id = uuid.v4();
  sessions.set(id, {});
  await pool.query('INSERT INTO sessions (id) VALUES ($1)', [id]);
  res.send({ sessionId: id });
});

app.get('/sessions', auth, async (req, res) => {
  const { rows } = await pool.query('SELECT id FROM sessions');
  res.send(rows.map(({ id }) => ({ id })));
});

app.post('/message', async (req, res) => {
  const { recipient, message, sessionId } = req.body;
  if (!sessions.has(sessionId)) {
    res.sendStatus(404);
    return;
  }
  await pool.query(
    'INSERT INTO messages (receiver, message, session_id) VALUES ($1, $2, $3)',
    [recipient, message, sessionId]
  );
  res.sendStatus(200);
});

app.get('/messages', auth, async (req, res) => {
  const { sessionId } = req.query;
  const { rows } = await pool.query(
    'SELECT receiver, message FROM messages WHERE session_id = $1',
    [sessionId]
  );
  res.send(rows);
});

app.listen(8080);
