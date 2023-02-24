import { SetStateAction, useState } from 'react';
import './dashboard.css';
import Messages from '../../components/messages';
import ChatInput from '../../components/chat-input';

function Dashboard() {
  //   const [message, setMessage] = useState('');
  const today: Date = new Date();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hi there! How can I help you today?',
      sender: 'Admin1',
      timestamp: today,
    },
    {
      id: 2,
      content: 'Hi! I need some assistance with my account.',
      sender: 'King88',
      timestamp: today,
    },
    {
      id: 3,
      content: 'Sure, what can I help you with?',
      sender: 'Admin1',
      timestamp: today,
    },
  ]);
  function handleMessageSubmit(event: any) {
    event.preventDefault();
    // TODO: Handle submitting message to help desk user
  }
  return (
    <div className="dashboard">
      <h1>Anonymous User Dashboard</h1>
      <div className="chat-area">
        <Messages messages={messages} currentUser="King88" />
        <ChatInput onSend={handleMessageSubmit} />
      </div>
    </div>
  );
}

export default Dashboard;
