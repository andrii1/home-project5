import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import './RandomColorGenerator.Style.css';

export const RandomColorGenerator = () => {
  return (
    <div className="random-color-generator-container">
      <div className="button-group">
        <Button secondary label="Create HEX Color" />
        <Button secondary label="Create RGB Color" />
        <Button secondary label="Generate Random Color" />
      </div>
    </div>
  );
};
