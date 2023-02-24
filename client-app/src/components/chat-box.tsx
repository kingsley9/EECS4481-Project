import React, { useEffect, useState } from 'react';
import Messages from './messages';
import ChatInput from './chat-input';
import { Message } from '../data/message';
import { getMessages, sendMessage } from '../services/user-message';

interface Props {
  sessionId: string;
}

const ChatBox: React.FC<Props> = (props) => {
  const today: Date = new Date();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: 'Hi there! How can I help you today?',
      sender: 'Admin1',
      timestamp: today,
    },
    {
      id: 2,
      message: 'Hi! I need some assistance with my account.',
      sender: 'King88',
      timestamp: today,
    },
    {
      id: 3,
      message: 'Sure, what can I help you with?',
      sender: 'Admin1',
      timestamp: today,
    },
  ]);

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
    <div>
      <Messages messages={messages} currentUser={''} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
