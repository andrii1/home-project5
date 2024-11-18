import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import './RandomColorGenerator.Style.css';

export const RandomColorGenerator = () => {
  const [typeOfColor, setTypeOfColor] = useState('hex');
  const [color, setColor] = useState();

  const createRandomNumber = (length) => {
    return Math.floor(Math.random() * length);
  };

  const handleCreateRandomHexColor = () => {
    const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let hexColor = '#';
    for (let i = 0; i < 6; i += 1) {
      hexColor += hex[createRandomNumber(hex.length)];
    }
    setColor(hexColor);
  };
  const handleCreateRandomRgbColor = () => {
    const r = createRandomNumber(256);
    const g = createRandomNumber(256);
    const b = createRandomNumber(256);

    setColor(`rgb(${r},${g},${b})`);
  };
  console.log(typeOfColor);
  console.log(color);
  return (
    <div className="random-color-generator-container">
      <div className="button-group">
        <Button
          onClick={() => setTypeOfColor('hex')}
          tertiary={typeOfColor === 'hex'}
          secondary={typeOfColor !== 'hex'}
          label="HEX Color"
        />
        <Button
          onClick={() => setTypeOfColor('rgb')}
          tertiary={typeOfColor === 'rgb'}
          secondary={typeOfColor !== 'rgb'}
          label="RGB Color"
        />
        <Button
          onClick={
            typeOfColor === 'hex'
              ? handleCreateRandomHexColor
              : handleCreateRandomRgbColor
          }
          primary
          label="Generate Random Color"
        />
      </div>
      <div
        className="random-color-result-container"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
};
