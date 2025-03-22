/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './BratGenerator.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';
import TextFormTextarea from '../../components/Input/TextFormTextarea.component';
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

const keywords = [];

const defaultColors = ['#8acf00', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'];

export const BratGenerator = () => {
  const [input, setInput] = useState();
  const [recipesData, setRecipesData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState('#8acf00');
  const [colorPickerSelected, setColorPickerSelected] = useState(false);
  const bratWrapperRef = useRef();

  const handleChangeColor = (colorParam) => {
    setColorPickerSelected(false);
    setColor(colorParam);
  };

  const downloadPNG = () => {
    const bratWrapper = bratWrapperRef.current;

    // Set canvas dimensions to 512x512 px
    const width = 512;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Apply blur filter to the background
    ctx.filter = 'blur(3px)';
    ctx.fillStyle = color; // Set background color
    ctx.fillRect(0, 0, width, height); // Draw the background

    // Apply blur to the text (line-height simulation and blur filter)
    ctx.filter = 'blur(1px)'; // Apply blur to text (adjust as needed)
    ctx.font = '700 47.7px "Roboto", sans-serif'; // Set font size
    ctx.textAlign = 'center'; // Align text in the center horizontally
    ctx.textBaseline = 'middle'; // Align text in the center vertically

    const textX = width / 2; // Center the text horizontally
    const textY = height / 2; // Center the text vertically

    // Draw the text (apply line height)
    ctx.fillStyle = 'black'; // Set text color to white
    ctx.fillText(input, textX, textY);

    // Convert canvas content to PNG image
    const imgData = canvas.toDataURL('image/png');

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'brat-image.png'; // Set file name
    link.click();
  };

  return (
    <main className="single-app-container">
      <Helmet>
        <title>Brat generator</title>
        <meta name="description" content="decsription" />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Brat generator</h1>
      </header>
      <section className="app-input-container">
        <div className="search-input-container">
          <TextFormTextarea
            value={input}
            placeholder="Enter text..."
            onChange={setInput}
          />
          <div className="color-group">
            {defaultColors.map((item) => (
              <button
                type="button"
                className={`color-input ${item === color && 'selected'}`}
                style={{ backgroundColor: item }}
                onClick={() => handleChangeColor(item)}
              />
            ))}
            <input
              type="color"
              className={`color-picker ${colorPickerSelected && 'selected'}`}
              onChange={(event) => {
                setColor(event.target.value);
                setColorPickerSelected(true);
              }}
            />
          </div>
          {/* <Button onClick={handleInput} primary label="Search" /> */}
        </div>
      </section>
      <section className="app-result-container">
        <div className="brat-wrapper" ref={bratWrapperRef}>
          <div className="brat-container" style={{ backgroundColor: color }} />
          <div className="brat-text">{input}</div>
        </div>
        <Button onClick={downloadPNG} primary label="Download" />
        {/* {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {recipesData && !error && (
              <div className="container-cards">{recipes}</div>
            )}
          </>
        )} */}
      </section>
    </main>
  );
};
