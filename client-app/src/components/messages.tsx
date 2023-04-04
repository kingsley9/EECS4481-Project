import React from 'react';
import './Messages.css';
import { Message } from '../data/message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface Props {
  messages: Message[];
  role: string;
  onFileDownload: (fileId: string, fileName: string) => void;
}

const Messages: React.FC<Props> = ({ messages, role, onFileDownload }) => {
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
            <div key={file.fileId} className="file-container">
              {file.fileType.startsWith('image') ? (
                <img
                  className="file-image"
                  src={`/api/user/file/${file.fileId}`}
                  alt={file.filename}
                />
              ) : (
                <div className="file-image file-icon">
                  <span className="file-extension">
                    {file.fileType.split('/')[1]}
                  </span>
                </div>
              )}
              <div className="file-details">
                <span className="file-name">{file.filename}</span>
                <button
                  className="file-download"
                  onClick={() => onFileDownload(file.fileId, file.filename)}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Messages;
