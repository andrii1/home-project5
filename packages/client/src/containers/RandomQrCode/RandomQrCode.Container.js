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
import { Radio } from '../../components/Radio/Radio.component';
import { Text, Dices, QrCode, Dice3, Dice5, ScanQrCode } from 'lucide-react';

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
  'upi qr code generator',
];

const optionsSize = [
  { label: 'Low quality (256x256)', value: '256' },
  { label: 'Medium quality (512x512)', value: '512' },
  { label: 'High quality (1024x1024)', value: '1024' },
];

const optionsLevel = [
  { label: 'Level L', value: 'L' },
  { label: 'Level M', value: 'M' },
  { label: 'Level Q', value: 'Q' },
  { label: 'Level H', value: 'H' },
];

export const RandomQrCode = () => {
  const [input, setInput] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [threeQrCodes, setThreeQrCodes] = useState([]);
  const [fiveQrCodes, setFiveQrCodes] = useState([]);
  const [tab, setTab] = useState('Random code');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [size, setSize] = useState('256');
  const [level, setLevel] = useState('L');
  const [mode, setMode] = useState('string');
  const [username, setUsername] = useState(''); // Username part of UPI ID
  const [upiProvider, setUpiProvider] = useState(''); // Default provider
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const svgRef = useRef();

  useEffect(() => {
    setQrCode(getRandomString(10));
  }, []);

  useEffect(() => {
    const threeQrCodesArray = Array.from({ length: 3 }, () => ({
      id: crypto.randomUUID(),
      value: getRandomString(10),
    }));
    const fiveQrCodesArray = Array.from({ length: 5 }, () => ({
      id: crypto.randomUUID(),
      value: getRandomString(10),
    }));
    setThreeQrCodes(threeQrCodesArray);
    setFiveQrCodes(fiveQrCodesArray);
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

  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomEmail = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const domains = [
      '@gmail.com',
      '@yahoo.com',
      '@outlook.com',
      '@example.com',
      '@hotmail.com',
    ];

    // Generate a random string for the local part of the email (before the '@')
    let randomString = '';
    for (let i = 0; i < 10; i += 1) {
      // You can adjust the length (10 in this case)
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
      randomString += randomChar;
    }

    // Randomly select a domain
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];

    return randomString + randomDomain;
  };

  const getRandomWikipediaArticle = () => {
    return `https://en.wikipedia.org/wiki/Special:Random`;
  };

  const getRandomMemeURL = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes');
    const data = await response.json();
    const { memes } = data.data;
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    return randomMeme.url; // Returns the URL of the meme image
  };

  const getRandomWebsiteURL = () => {
    const websites = [
      'https://www.boredpanda.com/',
      'https://www.funbrain.com/',
      'https://www.wikipedia.org/',
      'https://www.khanacademy.org/',
      'https://www.duolingo.com/',
    ];
    return websites[Math.floor(Math.random() * websites.length)];
  };

  const generateAIText = async (userContent) => {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API}`,
          },
          body: JSON.stringify({
            model: 'gpt-4', // or "gpt-3.5-turbo"
            messages: [
              {
                role: 'system',
                content: 'You generate random paragraphs on various topics.',
              },
              {
                role: 'user',
                content: userContent,
              },
            ],
            temperature: 0.8, // Increases randomness
            max_tokens: 100, // Adjust for longer paragraphs
          }),
        },
      );

      const data = await response.json();
      // console.log(data);

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      // console.error('No response from API:', data);
      return null;
    } catch (error) {
      // console.error('Error fetching paragraph:', error);
      return null;
    }
  };

  const generateUpiLink = () => {
    if (!username || !upiProvider) return ''; // Ensure both fields are filled

    let upiLink = `upi://pay?pa=${encodeURIComponent(
      username,
    )}@${encodeURIComponent(upiProvider)}`;

    if (amount) upiLink += `&am=${encodeURIComponent(amount)}`;
    if (name) upiLink += `&pn=${encodeURIComponent(name)}`;

    return upiLink;
  };

  const handleGenerateQrCode = async () => {
    if (tab === 'Random code') {
      setQrCode(getRandomString(10));
    } else if (tab === 'Random') {
      if (mode === 'string') {
        setQrCode(getRandomString(10));
      } else if (mode === 'number') {
        setQrCode(generateRandomNumber(1, 100));
      } else if (mode === 'e-mail') {
        setQrCode(generateRandomEmail());
      } else if (mode === 'text') {
        const aiText = await generateAIText(
          'Generate a random paragraph about any topic. Maximum 200 characters.',
        );
        setQrCode(aiText);
      } else if (mode === 'word') {
        const aiText = await generateAIText('Generate a random word.');
        setQrCode(aiText);
      } else if (mode === 'quote') {
        const aiText = await generateAIText(
          'Generate a random quote about any topic. Maximum 150 characters.',
        );
        setQrCode(aiText);
      } else if (mode === 'fun-fact') {
        const aiText = await generateAIText(
          'Generate a random fun fact. Maximum 150 characters.',
        );
        setQrCode(aiText);
      } else if (mode === 'wiki') {
        setQrCode(getRandomWikipediaArticle());
      } else if (mode === 'meme') {
        const meme = await getRandomMemeURL();
        setQrCode(meme);
      } else if (mode === 'website') {
        setQrCode(getRandomWebsiteURL());
      }
    } else if (tab === '3 random codes') {
      setThreeQrCodes(
        threeQrCodes.map(() => ({
          id: crypto.randomUUID(),
          value: getRandomString(10),
        })),
      );
    } else if (tab === '5 random codes') {
      setFiveQrCodes(
        fiveQrCodes.map(() => ({
          id: crypto.randomUUID(),
          value: getRandomString(10),
        })),
      );
    } else if (tab === 'Text') {
      setQrCode(input);
      // setInput('');
    } else if (tab === 'upi') {
      if (!username || !upiProvider) {
        setInvalidForm(true);
        setValidForm(false);
      } else {
        setQrCode(generateUpiLink());
        setInvalidForm(false);
        setValidForm(true);
      }
    }
  };

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
            icon={<QrCode size={14} />}
          />
          <Button
            tertiary={tab === '3 random codes'}
            secondary={tab !== '3 random codes'}
            label="3 random codes"
            className="tab"
            onClick={() => setTab('3 random codes')}
            icon={<Dice3 size={14} />}
          />
          <Button
            tertiary={tab === '5 random codes'}
            secondary={tab !== '5 random codes'}
            label="5 random codes"
            className="tab"
            onClick={() => setTab('5 random codes')}
            icon={<Dice5 size={14} />}
          />
          <Button
            tertiary={tab === 'Random'}
            secondary={tab !== 'Random'}
            label="Random"
            className="tab"
            onClick={() => setTab('Random')}
            icon={<Dices size={14} />}
          />
          <Button
            tertiary={tab === 'Text'}
            secondary={tab !== 'Text'}
            label="Text"
            className="tab"
            onClick={() => setTab('Text')}
            icon={<Text size={14} />}
          />
          <Button
            tertiary={tab === 'upi'}
            secondary={tab !== 'upi'}
            label="UPI"
            className="tab"
            onClick={() => setTab('upi')}
            icon={<ScanQrCode size={14} />}
          />
        </div>
      </section>
      {tab === 'Random code' ||
      tab === '3 random codes' ||
      tab === '5 random codes' ? (
        <section className="app-result-container">
          {tab === 'Random code' && (
            <QRCode
              id="qr-code-value"
              value={qrCode}
              level="L"
              size={256}
              title="QR Code"
            />
          )}
          {tab === '3 random codes' && threeQrCodes && (
            <div className="flex-3">
              {threeQrCodes.map((item) => (
                <QRCode
                  key={item.id}
                  value={item.value}
                  level="L"
                  size={256}
                  title="QR Code"
                />
              ))}
            </div>
          )}
          {tab === '5 random codes' && fiveQrCodes && (
            <div className="flex-5">
              {fiveQrCodes.map((item) => (
                <QRCode
                  key={item.id}
                  value={item.value}
                  level="L"
                  size={256}
                  title="QR Code"
                />
              ))}
            </div>
          )}
          <Button onClick={handleGenerateQrCode} primary label="Regenerate" />
        </section>
      ) : null}
      {tab === 'Random' || tab === 'Text' || tab === 'upi' ? (
        <div className="generator-container">
          <section className="app-input-generator">
            {tab === 'Random' && (
              <div className="input-group">
                <Radio
                  value="string"
                  label="Random string"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'string'}
                />
                <Radio
                  value="number"
                  label="Random number"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'number'}
                />
                <Radio
                  value="e-mail"
                  label="Random e-mail"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'e-mail'}
                />
                <Radio
                  value="text"
                  label="Random text"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'text'}
                />

                <Radio
                  value="word"
                  label="Random word"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'word'}
                />
                <Radio
                  value="quote"
                  label="Random quote"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'quote'}
                />
                <Radio
                  value="fun-fact"
                  label="Random fun fact"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'fun-fact'}
                />
                <Radio
                  value="wiki"
                  label="Random WikiPedia article"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'wiki'}
                />
                <Radio
                  value="meme"
                  label="Random meme"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'meme'}
                />
                <Radio
                  value="website"
                  label="Random website"
                  onChange={(event) => setMode(event.target.value)}
                  checked={mode === 'website'}
                />
              </div>
            )}
            {tab === 'Text' && (
              <TextFormTextarea
                className="input-wrapper-text"
                value={input}
                placeholder="Enter your value"
                onChange={setInput}
              />
            )}
            {tab === 'upi' && (
              <div className="upi-container">
                <div className="input-group-upi">
                  <TextFormInput
                    value={username}
                    placeholder="cashlessconsumer"
                    onChange={setUsername}
                  />
                  <span>@</span>
                  <TextFormInput
                    value={upiProvider}
                    placeholder="cnrb"
                    onChange={setUpiProvider}
                  />
                </div>
                <TextFormInput
                  value={name}
                  placeholder="Srikanth"
                  onChange={setName}
                />
                <TextFormInput
                  value={amount}
                  placeholder="10"
                  onChange={setAmount}
                />
                {invalidForm && (
                  <p className="error-message">Form is not valid</p>
                )}
              </div>
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
                  onClick={handleGenerateQrCode}
                  primary
                  label="Generate QR code"
                />
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
};
