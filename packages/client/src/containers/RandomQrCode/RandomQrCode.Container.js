/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import './RandomQrCode.Style.css';
import QRCode from 'react-qr-code';
import TextFormInput from '../../components/Input/TextFormInput.component';

const keywords = [
  'random qr code',
  'random qr',
  'random qr generator',
  'qr code random',
  'random qr codes',
  'random q r codes',
  'qr codes random',
  'generate random qr code',
  'random qr codes to scan',
  'random qr code maker',
];

export const RandomQrCode = () => {
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [tab, setTab] = useState('Random code');

  const handleGenerateQrCode = () => {
    setQrCode(input);
    setInput('');
  };

  return (
    <main className="single-app-container">
      <Helmet>
        <title>Random QR Code</title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Random QR code</h1>
      </header>
      <section className="app-input-container">
        <div className="tab-group">
          <Button
            tertiary={tab === 'Random code'}
            secondary={tab !== 'Random code'}
            label="Random code"
            className="tab"
            onClick={() => setTab('Random code')}
          />
          <Button
            tertiary={tab === 'Random string'}
            secondary={tab !== 'Random string'}
            label="Random string"
            className="tab"
            onClick={() => setTab('Random string')}
          />
          <Button
            tertiary={tab === 'Random number'}
            secondary={tab !== 'Random number'}
            label="Random number"
            className="tab"
            onClick={() => setTab('Random number')}
          />
          <Button
            tertiary={tab === 'Random text'}
            secondary={tab !== 'Random text'}
            label="Random text"
            className="tab"
            onClick={() => setTab('Random text')}
          />
        </div>
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
      </section>
      <section className="app-result-container">
        <QRCode id="qr-code-value" value={qrCode} />
      </section>
    </main>
  );
};
