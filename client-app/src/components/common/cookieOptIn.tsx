import React, { FunctionComponent } from 'react';
import './cookieOptIn.css';

type CookieOptInProps = {
  showBanner: boolean;
  handleAllowCookies: () => void;
  handleDeclineCookies: () => void;
};

const CookieOptIn: FunctionComponent<CookieOptInProps> = ({
  showBanner,
  handleAllowCookies,
  handleDeclineCookies,
}) => {
  return showBanner ? (
    <div className="cookie-optin-container">
      <p className="cookie-message">
        This website uses cookies to enhance your user experience.
      </p>
      <div className="cookie-buttons">
        <button className="cookie-allow" onClick={handleAllowCookies}>
          Allow cookies
        </button>
        <button className="cookie-decline" onClick={handleDeclineCookies}>
          Decline
        </button>
      </div>
    </div>
  ) : null;
};

export default CookieOptIn;
