import React, { useEffect, useState } from 'react';
import Messages from './messages';
import ChatInput from './chat-input';
import { Message } from '../data/message';
import { getMessages, sendMessage, downloadFile } from '../services/user-message';
import './chat-box.css';

interface Props {
  sessionId: string;
  token?: string;
  role: string;
}

const ChatBox: React.FC<Props> = (props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(props.sessionId);
      setMessages(messages);
    };
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, [props.sessionId]);

  const handleSend = async (text: string, file?: File) => {
    if (props.token) {
      await sendMessage(text, props.sessionId, props.token, file);
    } else {
      await sendMessage(text, props.sessionId, undefined, file);
    }

    const updatedMessages = await getMessages(props.sessionId);
    setMessages(updatedMessages);
  };

  const handleFileDownload = async (fileId: string, fileName: string) => {
    if (props.token) {
      await downloadFile(fileId, fileName, props.sessionId, props.token);
    } else {
      await downloadFile(fileId, fileName, props.sessionId);
    }
  };

  return (
    <div className="chat-area">
      <div>
        <Messages
          messages={messages}
          role={props.role}
          onFileDownload={handleFileDownload}
        />
        <hr />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatBox;
