-- Create admins table
CREATE TABLE admins (
  adminId SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  adminId INTEGER,
  FOREIGN KEY (adminId) REFERENCES admins(adminId)
);

-- Create user_messages table
CREATE TABLE user_messages (
  id SERIAL PRIMARY KEY,
  session UUID,
  senderType VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (session) REFERENCES sessions(id)
);