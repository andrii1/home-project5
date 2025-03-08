/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
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

const optionsSize = ['256', '512', '1024'];

const optionsLevel = ['L', 'M', 'Q', 'H'];

export const RandomQrCode = () => {
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [tab, setTab] = useState('Random codesd');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [size, setSize] = useState('256');
  const [level, setLevel] = useState('L');
  const svgRef = useRef();

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

  const downloadPNG = () => {
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);

    // Get selected QR size from dropdown
    const exportSize = parseInt(size, 10); // Convert size to number

    // Create an Image element
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Create a canvas with the selected size
      const canvas = document.createElement('canvas');
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext('2d');

      // Draw SVG on Canvas at full resolution
      ctx.drawImage(img, 0, 0, exportSize, exportSize);
      URL.revokeObjectURL(url);

      // Convert Canvas to PNG
      const pngUrl = canvas.toDataURL('image/png');

      // Create a download link
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `qr-code-${exportSize}x${exportSize}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    img.src = url;
  };

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
            size="High quality (1024x1024)"
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
            <div className="qr-code-container">
              <QRCode
                id="qr-code-value"
                value={qrCode}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                size={size} // Selected export size
                ref={svgRef}
                style={{
                  maxWidth: '16rem',
                  maxHeight: '16rem',
                  width: '100%',
                  height: 'auto',
                }} // UI limit
              />
            </div>
            <div className="customization-container">
              <div className="color-input-group">
                <TextFormInput
                  value={fgColor}
                  placeholder="Enter your value"
                  onChange={setFgColor}
                  type="color"
                  className="color-input"
                />
                <TextFormInput
                  value={bgColor}
                  placeholder="Enter your value"
                  onChange={setBgColor}
                  type="color"
                  className="color-input"
                />
              </div>
              <Dropdown options={optionsSize} onSelect={setSize} />
              <Dropdown options={optionsLevel} onSelect={setLevel} />
              <div>
                <Button onClick={downloadPNG} secondary label="Download" />
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
