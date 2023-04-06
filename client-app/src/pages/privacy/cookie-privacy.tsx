import React from 'react';
import './cookie-privacy.css';

const CookiePrivacy = () => {
  return (
    <div className="cookie-privacy">
      <h1 style={{ textAlign: 'center' }}>Cookie Policy</h1>
      <p>
        Last updated: Apr 03, 2023
      </p>
      <p>
        Help Desk App and our third-party partners use cookies and similar technologies to enhance your web experience. This policy provides information about these technologies and your choices regarding their use. We obtain your consent for using these technologies by providing transparent notice and giving you the opportunity to disable them. To learn more about our privacy practices, please review our Privacy Policy.
      </p>
      <h2>Types of technologies we use:</h2>
      <ul>
        <li>
          <strong>Cookies:</strong> Small data files stored on your device that remember information about you or your device. We use cookies for session management and retaining your preferences. Our cookies include:
          <ul>
            <li>session: This cookie lasts for 1 hour and manages your session.</li>
            <li>token: This cookie lasts for 1 hour and stores your authentication token.</li>
          </ul>
        </li>
        <li>
          <strong>Web Beacons:</strong> Small electronic images included on our site, emails, and services. They work with cookies to identify our users and user behavior.
        </li>
        <li>
          <strong>Similar Technologies:</strong> Technologies that store information in your browser, such as flash cookies, HTML 5 cookies, and other web application software methods. These technologies may not be fully managed by your browser and may require management directly through your installed applications or device.
        </li>
      </ul>
      <h2>How to opt-out:</h2>
      <p>
        You can manage your cookie preferences by adjusting your browser settings, which allows you to block, delete, or disable cookies. Note that disabling necessary cookies may affect the functionality of the website.
      </p>
      <p>
        For more information on how to manage cookies in popular browsers, please visit the following links:
      </p>
      <ul>
        <li>
          Google Chrome: <a href="https://support.google.com/chrome/answer/95647">https://support.google.com/chrome/answer/95647</a>
        </li>
        <li>
          Mozilla Firefox: <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences">https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences</a>
        </li>
        <li>
          Microsoft Edge: <a href="https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d">https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d</a>
        </li>
        <li>
          Apple Safari: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a>
        </li>
      </ul>
    </div>
  );
};

export default CookiePrivacy;
