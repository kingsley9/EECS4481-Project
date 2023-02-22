CREATE TABLE sessions (
  id UUID PRIMARY KEY NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sender VARCHAR(255),
  receiver VARCHAR(255),
  message TEXT NOT NULL,
  session_id UUID NOT NULL REFERENCES sessions(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (sender, receiver, session_id)
);
