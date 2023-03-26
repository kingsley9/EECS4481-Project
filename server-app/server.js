require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const basicAuth = require('basic-auth');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const jwt_decode = require('jwt-decode');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only images and PDFs are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB in bytes
  },
});

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', 'SessionId', 'x-access-token', 'x-message-content'],
  })
);

app.options('*', cors());

app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(helmet.dnsPrefetchControl());
app.use(
  helmet.frameguard({
    action: 'deny',
  })
);
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

const pool = new Pool({
  user: 'dbadmin',
  host: 'localhost',
  database: 'messaging_app',
  password: 'password',
  port: 5432,
});

app.use(bodyParser.json());

const sessions = new Map();
const secret = process.env.JWT_SECRET;

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  pool.query(
    'SELECT * FROM admins WHERE username = $1 AND password = $2',
    [username, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else if (results.rows.length > 0) {
        const admin = {
          username: username,
          adminId: results.rows[0].adminid,
          role: 'admin',
        };
        const token = jwt.sign(admin, secret, { expiresIn: '1h' });
        res.status(200).send({ token });
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
  );
});

const auth = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized request');
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized request');
    }

    if (decoded.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }

    req.admin = decoded.username;
    next();
  });
};

app.get('/api/admin/verify', auth, (req, res) => {
  res.status(200).send({ isValid: true });
});

app.get('/api/admin', auth, (req, res) => {
  res.status(200).send({ message: `Welcome ${req.admin}` });
});

app.get('/api/admin/sessions', auth, async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  const decoded = jwt_decode(token);
  const adminId = decoded.adminId;
  const { rows } = await pool.query(
    'SELECT id FROM sessions WHERE adminid = $1',
    [adminId]
  );
  res.send(rows);
});

app.get('/api/admin/list', auth, async (req, res) => {
  const { rows } = await pool.query('SELECT adminid, username FROM admins');
  res.send(rows);
});

app.post('/api/session', async (req, res) => {
  const id = uuid.v4();
  const { rows } = await pool.query(
    'SELECT adminid FROM admins ORDER BY RANDOM() LIMIT 1'
  );
  const adminId = rows[0].adminid;
  sessions.set(id, { adminId });
  await pool.query('INSERT INTO sessions (id, adminId) VALUES ($1, $2)', [
    id,
    adminId,
  ]);
  res.send({ sessionId: id });
});

app.post('/api/user/message', auth, upload.single('file'), async (req, res) => {
  const sessionId = req.headers.sessionid;
  const message = req.headers["x-message-content"];
  const token = req.headers["x-access-token"];
  let userType = 'user';
  if (token != '') {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized request');
      }

      if (decoded.role !== 'admin') {
        return res.status(403).send('Forbidden');
      }

      userType = decoded.role;
    });
  }

  const filename = req.file ? req.file.filename : null;
  const originalFilename = req.file ? req.file.originalname : null;
  const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/api/user/file/${req.file.filename}` : null;
  await pool.query(
    'INSERT INTO user_messages (sender, message, session, filename, original_filename, file_url) VALUES ($1, $2, $3, $4, $5, $6)',
    [userType, message, sessionId, filename, originalFilename, fileUrl]
  );
  res.sendStatus(200);
});

app.get('/api/user/file/:filename', auth, async (req, res) => {
  const filename = req.params.filename;
  const sessionId = req.headers.sessionid;
  const token = req.headers['x-access-token'];
  let userType = 'user';
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized request');
      }

      if (decoded.role !== 'admin') {
        return res.status(403).send('Forbidden');
      }

      userType = decoded.role;
    });
  }

  // Retrieve the file path and original filename from the database
  const { rows } = await pool.query(
    'SELECT filename, original_filename, sender FROM user_messages WHERE filename = $1 AND session = $2',
    [filename, sessionId]
  );
  const sender = rows[0]?.sender;
  const filePath = rows[0]?.filename;
  const originalFilename = rows[0]?.original_filename;
  if (!filePath || sender !== 'admin' && sender !== userType) {
    return res.status(403).send('Forbidden');
  }

  // Send the file as an attachment with the original filename
  const file = path.join(__dirname, '..', filePath);
  res.download(file, originalFilename);
});

app.get('/api/messages', async (req, res) => {
  const sessionId = req.headers.sessionid;
  if (sessionId != '') {
    const { rows } = await pool.query(
      'SELECT id, sender, message, filename, original_filename, file_url, created_at FROM user_messages WHERE session = $1',
      [sessionId]
    );
    const messages = rows.map((message) => {
      if (message.filename) {
        const fileUrl = `${req.protocol}://${req.get('host')}/api/user/file/${message.filename}`;
        return { ...message, fileUrl };
      }
      return message;
    });
    res.send(messages);
  }
});

app.patch('/api/user/update', auth, async (req, res) => {
  const { sessionId, adminId } = req.body;
  try {
    await pool.query(
      'UPDATE sessions SET adminId = $1, updated_at = NOW() WHERE id = $2',
      [adminId, sessionId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


app.post('/api/admin/message', auth, async (req, res) => {
  const sessionId = req.headers.sessionid;
  const { message, token } = req.body;
  await pool.query(
    'INSERT INTO user_messages (sender, message, session) VALUES ($1, $2, $3)',
    ['admin', message, sessionId]
  );
  res.sendStatus(200);
});

// Routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client-app/src'));
});

app.listen(3100);
