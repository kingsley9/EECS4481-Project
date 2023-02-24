import { SetStateAction, useState } from 'react';
import './dashboard.css';
import Messages from '../../components/messages';
import ChatInput from '../../components/chat-input';

function Dashboard() {
  //   const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, content: 'Hi there! How can I help you today?', sender: 'Admin1' },
    {
      id: 2,
      content: 'Hi! I need some assistance with my account.',
      sender: 'King88',
    },
    { id: 3, content: 'Sure, what can I help you with?', sender: 'Admin1' },
  ]);
  function handleMessageSubmit(event: any) {
    event.preventDefault();
    // TODO: Handle submitting message to help desk user
  }
  return (
    <div className="dashboard">
      <h1>Anonymous User Dashboard</h1>
      {/* <p>Send a message to your help desk user</p> */}
      <div className="chat-area">
        {/* TODO: Display chat messages with help desk user */}
        <Messages messages={messages} currentUser="King88" />
        <ChatInput onSend={handleMessageSubmit} />
        {/* <form onSubmit={handleMessageSubmit}>
          <div className="message-bar">
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(event: {
                target: { value: SetStateAction<string> };
              }) => setMessage(event.target.value)}
            ></textarea>
            <button type="submit">Send</button>
          </div>
        </form> */}
      </div>
    </div>
  );
}

export default Dashboard;
