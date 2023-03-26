import React, { useState, useRef } from 'react';
import './chat-input.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'reactstrap';

interface Props {
  onSend: (text: string, file?: File) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputText(file.name);
      setFile(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() || file) {
      onSend(text, file);
      setText('');
      setInputText('');
      setFile(undefined);
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="message-bar">
        <Input
          type="textarea"
          value={inputText || text}
          onChange={handleInputChange}
        />

        <div className="file-upload-label" onClick={handleIconClick}>
          <span className="file-upload-icon">
            <FontAwesomeIcon icon={faPlus} />
          </span>
          <Input
            type="file"
            name="file"
            className="file-upload-input"
            id="file-upload"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleFileInputChange}
            style={{ position: 'absolute', opacity: 0, zIndex: -1 }}
            innerRef={fileInputRef}
          />
        </div>

        <button type="submit">Send</button>
      </div>
    </form>
  );
};

export default ChatInput;
