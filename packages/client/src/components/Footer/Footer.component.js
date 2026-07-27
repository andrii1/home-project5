import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.styles.css';
import { Donate } from '../Donate/Donate.component';

export const Footer = () => {
  return (
    <div className="site-footer">
      <div className="footer-container">
        <Donate />
        <div className="menu">
          <ul>
            <li>
              <a
                href="https://www.buymeacoffee.com/mrhackio"
                target="_blank"
                rel="noopener noreferrer"
              >
                ☕ Buy Me a Coffee
              </a>
            </li>
            <li>
              <a
                href="https://paypal.me/museuly"
                target="_blank"
                rel="noopener noreferrer"
              >
                💙 Support with PayPal
              </a>
              {/* <NavLink to="/faq" className="nav-link">
              FAQ
            </NavLink> */}
            </li>
          </ul>
        </div>
        <span>&copy;2026</span>
      </div>
    </div>
  );
};
