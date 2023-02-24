import React, { useEffect, useState } from 'react';
import Messages from './messages';
import ChatInput from './chat-input';
import { Message } from '../data/message';
import { getMessages, sendMessage } from '../services/user-message';
import './chat-box.css';
interface Props {
  sessionId: string;
}

const ChatBox: React.FC<Props> = (props) => {
  const today: Date = new Date();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(props.sessionId);
      setMessages(messages);
    };
    fetchMessages();
  }, [props.sessionId]);

  const handleSend = async (text: string) => {
    await sendMessage(text, props.sessionId);
    const updatedMessages = await getMessages(props.sessionId);
    setMessages(updatedMessages);
  };

  return (
    <div className="chat-area">
      <div>
        <Messages messages={messages} currentUser={''} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatBox;
