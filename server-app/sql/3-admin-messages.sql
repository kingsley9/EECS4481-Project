CREATE TABLE admin_messages (
  id SERIAL PRIMARY KEY NOT NULL,
  sender INTEGER NOT NULL,
  recipient INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (sender) REFERENCES admins(adminid),
  FOREIGN KEY (recipient) REFERENCES admins(adminid)
);