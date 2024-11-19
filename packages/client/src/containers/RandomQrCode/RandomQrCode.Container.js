/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import './RandomQrCode.Style.css';
import QRCode from 'react-qr-code';
import TextFormInput from '../../components/Input/TextFormInput.component';

export const RandomQrCode = () => {
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleGenerateQrCode = () => {
    setQrCode(input);
    setInput('');
  };

  return (
    <main>
      <Helmet>
        <title>Random QR Code</title>
        <meta name="description" content="Random q r code" />
      </Helmet>
      <div className="hero">
        <h1 className="hero-header">Random QR code</h1>
      </div>
      <div className="qr-code-container">
        <div className="qr-code-input-container">
          <TextFormInput
            value={input}
            placeholder="Enter your value"
            onChange={setInput}
          />
          <Button
            onClick={handleGenerateQrCode}
            primary
            label="Generate QR Code"
            disabled={!(input && input.trim !== '')}
          />
        </div>
        <QRCode id="qr-code-value" value={qrCode} />
      </div>
    </main>
  );
};
