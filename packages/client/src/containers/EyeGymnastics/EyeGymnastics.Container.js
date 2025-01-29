/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef } from 'react';

import { Helmet } from 'react-helmet';
import './EyeGymnastics.Style.css';

export const EyeGymnastics = () => {
  let canvasRef = useRef(null);

  return (
    <main>
      <Helmet>
        <title>Eye gymnastics</title>
        <meta name="description" content="Eye gymnastics" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Eye gymnastics</h1>
        <p className="subheading">Follow the ball on the screen</p>
      </div>
      <section className="container-tool">
        <canvas
          ref={canvasRef}
          className="canvas-eye-gymnastics"
          width={window.innerWidth - 50}
          height={window.innerHeight - 50}
        >
          1
        </canvas>
      </section>
    </main>
  );
};
