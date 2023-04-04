-- Create admins table
CREATE TYPE senderType AS ENUM ('admin', 'user');

CREATE TABLE admins (
  adminid SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  adminid INTEGER NOT NULL,
  FOREIGN KEY (adminId) REFERENCES admins(adminId)
);

-- Create user_messages table
CREATE TABLE user_messages (
  id SERIAL PRIMARY KEY NOT NULL,
  session UUID NOT NULL,
  sender senderType NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (session) REFERENCES sessions(id)
);
