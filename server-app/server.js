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
      const id = uuid.v4();
      const filename = Date.now() + '-' + id;
      cb(null, filename);
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
app.use(express.static(path.join(__dirname, 'client-app', 'build')));

app.get('/', (req, res) => {});
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'SessionId',
      'x-access-token',
      'x-message-content',
    ],
  })
);

app.options('*', cors());

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

app.post('/api/user/message', upload.single('file'), async (req, res) => {
  const sessionId = req.headers.sessionid;
  const message = req.headers['x-message-content'];
  const token = req.headers['x-access-token'] | null;
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

  const filename = req.file ? req.file.filename : null;
  const originalFilename = req.file ? req.file.originalname : null;
  const fileType = req.file ? req.file.mimetype : null;
  await pool.query(
    'INSERT INTO user_messages (sender, message, session, filename, original_filename, file_type) VALUES ($1, $2, $3, $4, $5, $6)',
    [userType, message, sessionId, filename, originalFilename, fileType]
  );
  res.sendStatus(200);
});

app.get('/api/user/file/:fileid', async (req, res) => {
  const fileId = req.params.fileid;
  const sessionId = req.headers.sessionid;
  const token = req.headers['x-access-token'] | null;
  let userType = 'user';
  try {
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
      'SELECT session, filename, original_filename, file_type FROM user_messages WHERE filename = $1 AND session = $2',
      [fileId, sessionId]
    );
    const filePath = rows[0]?.filename;
    const fileType = rows[0]?.filename;
    const session = rows[0]?.session;
    if (
      (filePath && userType === 'admin') ||
      (filePath && session === sessionId)
    ) {
      const file = path.join(__dirname, '..', 'uploads', filePath);
      res.type(fileType);
      res.status(200).sendFile(file, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send('Internal server error');
        } else {
          console.log('Sent:', filePath);
        }
      });
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/messages', async (req, res) => {
  const sessionId = req.headers.sessionid;
  if (sessionId != '') {
    const { rows } = await pool.query(
      'SELECT id, sender, message, filename, original_filename, file_type, created_at FROM user_messages WHERE session = $1',
      [sessionId]
    );
    const messages = rows.map((message) => {
      const files = [];
      if (message.filename && message.original_filename && message.file_type) {
        files.push({
          filename: message.original_filename,
          fileId: message.filename,
          fileType: message.file_type,
        });
      }
      return {
        id: message.id,
        sender: message.sender,
        message: message.message,
        session: message.session,
        timestamp: message.created_at,
        files,
      };
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
  res.sendFile(path.join(__dirname, 'client-app', 'build', 'index.html'));
});

app.listen(3100);
