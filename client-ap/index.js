import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './styles/index.css';

class AnonymousUserButton extends React.Component {
  handleClick = async () => {
    const response = await axios.get('http://localhost:8080/session');
    const uuid = response.data.uuid;
    document.cookie = `uuid=${uuid}; expires=Session; path=/`;
    window.location.href = '/anonymous/dashboard';
  }

  render() {
    return (
      <button className="button button-anonymous" onClick={this.handleClick}>
        Anonymous User
      </button>
    );
  }
}

class AdminUserButton extends React.Component {
  handleClick = () => {
    // Handle admin user button click
  }

  render() {
    return (
      <button className="button button-admin" onClick={this.handleClick}>
        Admin User
      </button>
    );
  }
}

function App() {
  return (
    <div className="container">
      <h1>Welcome to my website!</h1>
      <div className="buttons">
        <AnonymousUserButton />
        <AdminUserButton />
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);