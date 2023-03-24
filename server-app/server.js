const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const basicAuth = require('basic-auth');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require("helmet");
const jwt_decode = require('jwt-decode');

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET','POST','PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', 'SessionId'],
  })
);

app.options('*', cors())

app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.dnsPrefetchControl());
app.use(
  helmet.frameguard({
    action: "deny",
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
const secret = 'mysecretkey'; // TODO: use env to import this value.

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  pool.query(
    'SELECT * FROM admins WHERE username = $1 AND password = $2',
    [username, password],
    (error, results) => {
      try{
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else if (results.rows.length > 0) {
        const admin = { username: username, adminId: results.rows[0].adminid, role: 'admin' };
        const token = jwt.sign(admin, secret, { expiresIn: '1h' });
        res.status(200).send({ token });
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Internal server error')}}
  );
});

const auth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized request');
    }
    jwt.verify(token, secret, (err, decoded) => {
      try {
        if (err) {
          return res.status(401).send('Unauthorized request');
        }

        if (decoded.role !== 'admin') {
          return res.status(403).send('Forbidden');
        }

        req.admin = decoded.username;
        next();
      } catch (error) {
        console.error(error);
... (151 lines left)
Collapse
message.txt
7 KB
@Exp3rtX Kindly check if all is good
I tested it and it works fine
Exp3rtX — Yesterday at 4:56 PM
@rubick can you open a PR with your changes?
https://github.com/kingsley9/EECS4481-Project-T5/blob/main/server-app/README.md#git-flow-for-changes
I'll check the server my changes might broke stuff.
Exp3rtX — Yesterday at 5:08 PM
I just checked everything looks good. @rubick I can get a on call with you to setup your local dev.
rubick — Yesterday at 5:09 PM
Sounds great bro, give me a few hours i have a quiz at 5:30 i i finish at 7:30.
Exp3rtX — Yesterday at 5:09 PM
sure whenever u want
just message me
rubick — Yesterday at 5:10 PM
Perfect
A-Lazygenius — Today at 4:03 PM
Fixed the hardcoded jwt secret using dotenv you guys will need to create a .env file locally in the server-app and store a jwt secret there like JWT_SECRET=mysecretkey
Exp3rtX — Today at 4:03 PM
👌👌
Exp3rtX — Today at 9:38 PM
@AK2001 any update on logging?
﻿
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const basicAuth = require('basic-auth');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require("helmet");
const jwt_decode = require('jwt-decode');

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET','POST','PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', 'SessionId'],
  })
);

app.options('*', cors())

app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(helmet.dnsPrefetchControl());
app.use(
  helmet.frameguard({
    action: "deny",
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
const secret = 'mysecretkey'; // TODO: use env to import this value.

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  pool.query(
    'SELECT * FROM admins WHERE username = $1 AND password = $2',
    [username, password],
    (error, results) => {
      try{
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else if (results.rows.length > 0) {
        const admin = { username: username, adminId: results.rows[0].adminid, role: 'admin' };
        const token = jwt.sign(admin, secret, { expiresIn: '1h' });
        res.status(200).send({ token });
      } else {
        res.status(401).send('Invalid username or password');
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Internal server error')}}
  );
});

const auth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized request');
    }
    jwt.verify(token, secret, (err, decoded) => {
      try {
        if (err) {
          return res.status(401).send('Unauthorized request');
        }

        if (decoded.role !== 'admin') {
          return res.status(403).send('Forbidden');
        }

        req.admin = decoded.username;
        next();
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};


app.get('/api/admin/verify', auth, (req, res) => {
  res.status(200).send({isValid: true});
});

app.get('/api/admin', auth, (req, res) => {
  res.status(200).send({message: `Welcome ${req.admin}`});
});

app.get('/api/admin/sessions', auth, async (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  const decoded = jwt_decode(token);
  const adminId = decoded.adminId;
  try {
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
  try {
    const { rows } = await pool.query(
      'SELECT adminid, username FROM admins'
    );
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/session', async (req, res) => {
  const id = uuid.v4();
  try {
    const { rows } = await pool.query('SELECT adminid FROM admins ORDER BY RANDOM() LIMIT 1');
    const adminId = rows[0].adminid;
    sessions.set(id, { adminId });
    await pool.query('INSERT INTO sessions (id, adminId) VALUES ($1, $2)', [id, adminId]);
    res.send({ sessionId: id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.post('/api/user/message', async (req, res) => {
  const { message, sessionId, token } = req.body;
  let userType = 'user';
  if (token != '') {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send('This is an Unauthorized request');
      }
  
      if (decoded.role !== 'admin') {
        return res.status(403).send('This is Forbidden');
      }
  
      userType = decoded.role;
      
    });
  }
  try {
    await pool.query(
      'INSERT INTO user_messages (sender, message, session) VALUES ($1, $2, $3)',
      [userType, message, sessionId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error!');
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
    res.status(500).send('Internal server error!');
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const sessionId = req.headers.sessionid;
    if (sessionId != '') {
      const { rows } = await pool.query(
        'SELECT id, sender, message, created_at FROM user_messages WHERE session = $1',
        [sessionId]
      );
      res.send(rows);
    } else {
      res.status(400).send('The Session ID not provided');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Be Aware! Internal server error');
  }
});

app.post('/api/admin/message', auth, async (req, res) => {
  try {
    const sessionId = req.headers.sessionid;
    const { message, token } = req.body;
    await pool.query(
      'INSERT INTO user_messages (sender, message, session) VALUES ($1, $2, $3)',
      ['admin', message, sessionId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('There is an Internal server eror');
  }
});

// Routes
app.get('/', function (req, res) {
  try {
    res.sendFile(path.join(__dirname, '..', 'client-app/src'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(3100, () => {
  console.log('Server started on port 3100');
});
