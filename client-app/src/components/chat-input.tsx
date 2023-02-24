import React, { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input type="text" value={text} onChange={handleInputChange} />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;
