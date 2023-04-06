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

app.get('/', (req, res) => {});
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://34.107.199.71', 'http://34.96.85.15'],
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
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(bodyParser.json());

const sessions = new Map();
const secret = process.env.JWT_SECRET;

app.post('/api/admin/login', (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
  
});

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(false);
      }

      if (decoded.role !== 'admin') {
        return reject(false);
      }
      
      return resolve(true);
    });
  });
};

const auth = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ messgage: 'Unauthorized request' });
  }
  try {
    const isValid = await verifyToken(token);
    
    if (isValid) {
      req.token = jwt_decode(token);
      next();
    } else {
      return res.status(403).send({ messgage: 'Request forbidden' });
    }
  } catch (error) {
    return res.status(403).send({ messgage: 'Request forbidden' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers['x-access-token']) {
    try {
      const token = req.headers['x-access-token'];
      const isValid = await verifyToken(token);

      if (isValid) {
        req.token = jwt_decode(token);
        next();
      } else {
        next();
      }
    } catch (error) {
      return res.status(403).send({ messgage: 'Internal server error' });
    }
  } else {
    next();
  }
};

app.get('/api/health', (req, res) => {
  try {
    res.status(200).send({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/admin/verify', auth, (req, res) => {
  try {
    res.status(200).send({ isValid: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/admin', auth, (req, res) => {
  try {
    res.status(200).send({ message: `Welcome ${req.token.username}` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/admin/sessions', auth, async (req, res) => {
  try {
    const adminId = req.token.adminId;
    const { rows } = await pool.query(
      'SELECT id FROM sessions WHERE adminid = $1',
      [adminId]
    );
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
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
  console.log(`Session id [${id}] created for admin id: ${adminId}`);
  res.send({ sessionId: id });
});

app.post('/api/user/message', optionalAuth, upload.single('file'), async (req, res) => {
  const sessionId = req.headers.sessionid;
  const message = req.headers["x-message-content"];


  let userType = 'user';

  const token = req.token;
  if (token) {
    const adminUsername = token.username;
    userType = 'admin';
  }

  console.log(`Message from ${userType} on session: ${sessionId}`);
  const filename = req.file ? req.file.filename : null;
  const originalFilename = req.file ? req.file.originalname : null;
  const fileType = req.file ? req.file.mimetype : null;
  await pool.query(
    'INSERT INTO user_messages (sender, message, session, filename, original_filename, file_type) VALUES ($1, $2, $3, $4, $5, $6)',
    [userType, message, sessionId, filename, originalFilename, fileType]
  );
  res.sendStatus(200);
});

app.get('/api/user/file/:fileid', optionalAuth, async (req, res) => {
  const fileId = req.params.fileid;
  const sessionId = req.headers.sessionid;
  let userType = 'user';
  try {
    const token = req.token;
    if (token) {
      const adminUsername = token.username;
      userType = 'admin';
    }

    // Retrieve the file path and original filename from the database
    const { rows } = await pool.query(
      'SELECT session, filename, original_filename, file_type FROM user_messages WHERE filename = $1 AND session = $2',
      [fileId, sessionId]
    );
    const filePath = rows[0]?.filename;
    const fileType = rows[0]?.file_type;
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

app.get('/api/messages', optionalAuth, async (req, res) => {
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


app.post('/api/admin/message/:adminId', auth, upload.single('file'), async (req, res) => {
  try {
    const recipientId = req.params.adminId;
    const senderId = req.token.adminId;
    const message = req.headers["x-message-content"];

    const filename = req.file ? req.file.filename : null;
    const original_filename = req.file ? req.file.originalname : null;
    const file_type = req.file ? req.file.mimetype : null;
    await pool.query(
      'INSERT INTO admin_messages (sender, recipient, message, filename, original_filename, file_type) VALUES ($1, $2, $3, $4, $5, $6)',
      [senderId, recipientId, message, filename, original_filename, file_type]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/admin/file/:fileid', auth, async (req, res) => {
  const fileId = req.params.fileid;
  try {
    const token = req.token;
    const adminUsername = token.username;
    const adminId = token.adminId;

    // Retrieve the file path and original filename from the database
    const { rows } = await pool.query(
      'SELECT filename, file_type FROM admin_messages WHERE filename = $1 AND (sender = $2 OR recipient = $2)',
      [fileId, adminId]
    );

    if (rows.length > 0) {
      const filePath = rows[0]?.filename;
      const fileType = rows[0]?.file_type;
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
      return res.status(403).send({ message: 'Forbidden'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/admin/messages/:adminId', auth, async (req, res) => {
  const recipientId = req.params.adminId;
  try {
    const senderId = req.token.adminId;

    const { rows } = await pool.query(
      'SELECT * FROM admin_messages WHERE (sender = $1 AND recipient = $2) OR (sender = $2 AND recipient = $1)',
      [senderId, recipientId]
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
        sender: message.sender == senderId ? 'user' : 'admin',
        message: message.message,
        session: null,
        timestamp: message.created_at,
        files,
      };
    });
    res.send(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(3100);
