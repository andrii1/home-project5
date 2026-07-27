/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Donate.styles.css';
import { Button } from '../Button/Button.component';
import { CircleHelp, CircleX, Info, Coffee, ChevronDown } from 'lucide-react';
import { useUserContext } from '../../userContext';

export const Donate = () => {
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="support-container">
      <div className={`support-box ${open && 'open-support'}`}>
        <a
          href="https://www.buymeacoffee.com/mrhackio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me a Coffee"
            style={{
              height: '60px',
              width: '217px',
            }}
          />
        </a>
        <a
          href="https://paypal.me/museuly"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: '#0070ba',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            width: '100%',
          }}
        >
          Donate with PayPal
        </a>
      </div>
      <Button
        secondary
        onClick={() => {
          setOpen(!open);
        }}
        backgroundColor="#ffe5d9"
        aria-label="Open support container"
        className="support-toggle-btn"
      >
        {open ? <ChevronDown className="icon" /> : <span>☕️ Support me</span>}
        {/* {open ? <ChevronDown className="icon" /> : <Coffee className="icon" />} */}
      </Button>
    </div>
  );
};

Donate.propTypes = {};

Donate.defaultProps = {};
