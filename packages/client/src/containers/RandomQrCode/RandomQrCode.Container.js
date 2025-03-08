/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import './RandomQrCode.Style.css';
import QRCode from 'react-qr-code';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';
import TextFormTextarea from '../../components/Input/TextFormTextarea.component';

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
  const [tab, setTab] = useState('Random codesd');

  useEffect(() => {
    setQrCode(getRandomString(10));
  }, []);

  const getRandomString = (length) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateRandomQrCode = () => {
    setQrCode(getRandomString(10));
  };

  const handleGenerateQrCode = () => {
    setQrCode(input);
    setInput('');
  };

  const handleQrSize = () => {};

  return (
    <main className="single-app-container random-qr-code">
      <Helmet>
        <title>Random QR Code</title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Random QR code</h1>
      </header>
      <section className="tab-group">
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
          <Button
            tertiary={tab === 'Text'}
            secondary={tab !== 'Text'}
            label="Text"
            className="tab"
            onClick={() => setTab('Text')}
          />
        </div>
      </section>
      {tab === 'Random code' && (
        <section className="app-result-container">
          <QRCode
            id="qr-code-value"
            value={qrCode}
            bgColor="#ccc"
            fgColor="#bbb"
            level="H"
            size="512"
            title="sadgsdg"
          />
          <Button
            onClick={handleGenerateRandomQrCode}
            primary
            label="Regenerate"
          />
        </section>
      )}
      {tab !== 'Random code' && (
        <div className="generator-container">
          <section className="app-input-generator">
            {tab === 'Text' && (
              <>
                <TextFormTextarea
                  className="input-wrapper-text"
                  value={input}
                  placeholder="Enter your value"
                  onChange={setInput}
                />
                {/* <Button
                  onClick={handleGenerateQrCode}
                  primary
                  label="Generate QR Code"
                  disabled={!(input && input.trim !== '')}
                /> */}
              </>
            )}
          </section>
          <section className="app-result-generator">
            <QRCode
              id="qr-code-value"
              value={qrCode}
              bgColor="#ccc"
              fgColor="#bbb"
              level="H"
              size="256"
              title="sadgsdg"
            />
            <div className="customization-container">
              <div className="color-input-group">
                <TextFormInput
                  value={input}
                  placeholder="Enter your value"
                  onChange={(e) => setForegroundColor(e.target.value)}
                  type="color"
                />
                <TextFormInput
                  value={input}
                  placeholder="Enter your value"
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  type="color"
                />
              </div>
              <Dropdown
                options={['1min', '2min', '3min', '5min', '10min']}
                onSelect={handleQrSize}
              />
              <div>
                <Button
                  onClick={handleGenerateRandomQrCode}
                  secondary
                  label="Download"
                />
              </div>
              <div>
                <Button
                  onClick={handleGenerateRandomQrCode}
                  primary
                  label="Generate QR code"
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};
