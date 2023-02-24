import React from 'react';
import { Message } from '../services/user-messages';
import './Messages.css';

interface Props {
  messages: Message[];
  currentUser: string;
}

const Messages: React.FC<Props> = ({ messages, currentUser }) => {
  return (
    <div className="messages-container">
      {messages.map((message: Message) => (
        <div
          className={`message ${
            message.sender === currentUser ? 'sent' : 'received'
          }`}
          key={message.id}
        >
          <span>{message.sender}:&nbsp;</span>

          <span>{message.content}</span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
