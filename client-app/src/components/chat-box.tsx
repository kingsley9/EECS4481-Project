import React, { useEffect, useState } from 'react';
import Messages from './messages';
import ChatInput from './chat-input';
import { getCookie } from '../utils/cookie';
import { Message } from '../data/message';
import { getMessages, sendMessage } from '../services/user-message';

const ChatBox: React.FC = () => {
    const sessionId = getCookie('sessionId');
    const [messages, setMessages] = useState<Message[]>([]);
  
    useEffect(() => {
      if (sessionId) {
        const fetchMessages = async () => {
          const messages = await getMessages(sessionId);
          setMessages(messages);
        };
        fetchMessages();
      }
    }, [sessionId]);
  
    const handleSend = async (text: string) => {
      if (sessionId) {
        await sendMessage(text, sessionId);
        const updatedMessages = await getMessages(sessionId);
        setMessages(updatedMessages);
      }
    };
  
    return (
      <div>
        <Messages messages={messages} />
        <ChatInput onSend={handleSend} />
      </div>
    );
  };
  
  export default ChatBox;