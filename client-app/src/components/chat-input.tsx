import React, { useState } from 'react';
import './chat-input.css';

interface Props {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="message-bar">
        <textarea value={text} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </div>
    </form>
  );
};

export default ChatInput;
