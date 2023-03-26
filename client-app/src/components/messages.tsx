import React from 'react';
import './Messages.css';

import { Message } from '../data/message';

interface Props {
  messages: Message[];
  currentUser: string;
  role: string;
}

const Messages: React.FC<Props> = ({ messages, currentUser, role }) => {
  return (
    <div className="messages-container">
      {messages.map((message: Message) => (
        <div
          className={`message ${role === message.sender ? 'sent' : 'received'}`}
          key={message.id}
        >
          <span>{message.sender}:&nbsp;</span>
          <span>{message.message}</span>
          {message.files && message.files.map((file) => (
            <div key={file.filename}>
              <a href={file.fileURL} target="_blank" rel="noopener noreferrer">{file.filename}</a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Messages;
