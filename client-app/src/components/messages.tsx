import React from 'react';
import { Message } from '../data/message';

interface Props {
  messages: Message[];
}

const Messages: React.FC<Props> = ({ messages }) => {
  return (
    <div>
      {messages.map((message: Message) => (
        <div>
          <span>{message.sender}: </span>
          <span>{message.message}</span>
          <span>{message.timestamp.toISOString()}</span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
