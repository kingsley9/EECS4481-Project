import React from 'react';
import './Messages.css';

import { Message } from '../data/message';

interface Props {
  messages: Message[];
  currentUser: string;
  role: string;
}

const Messages: React.FC<Props> = ({ messages, currentUser, role }) => {
  // console.log(messages[0].session);
  return (
    <div className="messages-container">
      {messages.map((message: Message) => (
        <div
          className={`message ${role === message.sender ? 'sent' : 'received'}`}
          key={message.id}
        >
          <span>{message.sender}:&nbsp;</span>
          <span>{message.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
