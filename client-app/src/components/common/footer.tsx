// footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-text">© 2023 Help Desk App. All rights reserved.</div>
      <div className="footer-links">
        <Link className="footer-link" to="/about">About</Link>
      </div>
    </footer>
  );
};

export default Footer;
