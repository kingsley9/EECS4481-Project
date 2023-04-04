import React, { useEffect, useState } from 'react';
import Messages from './messages';
import ChatInput from './chat-input';
import { Message } from '../data/message';
import { getAdminMessages, sendAdminMessage, downloadAdminFile } from '../services/admin-message';
import './chat-box-admin.css';

interface Props {
  token: string;
  adminId: number;
  role: string;
}

const AdminChatBox: React.FC<Props> = (props) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getAdminMessages(props.token, props.adminId);
      setMessages(messages);
    };
    fetchMessages();
  }, [props.adminId, props.token]);

  const handleSend = async (text: string, file?: File) => {
    await sendAdminMessage(text, props.token, props.adminId, file);
    const updatedMessages = await getAdminMessages(props.token, props.adminId);
    setMessages(updatedMessages);
  };

  const handleFileDownload = async (fileId: string, fileName: string) => {
    await downloadAdminFile(fileId, fileName, props.token);
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

export default AdminChatBox;
