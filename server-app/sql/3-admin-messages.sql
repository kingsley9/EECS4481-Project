CREATE TABLE admin_messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sender INTEGER REFERENCES admins (adminid) ON DELETE CASCADE NOT NULL,
  recipient INTEGER REFERENCES admins (adminid) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  filename VARCHAR(255),
  original_filename VARCHAR(255),
  file_type VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);