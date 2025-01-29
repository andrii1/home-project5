/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef } from 'react';

import { Helmet } from 'react-helmet';
import './EyeGymnastics.Style.css';

let radius = 50;
let vx = 7;
let vy = 7;
let move;

export const EyeGymnastics = () => {
  let canvasRef = useRef(null);
  useEffect(() => {
    let context = canvasRef.current.getContext('2d');
    let x = canvasRef.current.width / 2;
    let y = canvasRef.current.height / 2;
    const drawBall = () => {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fillStyle = '#b5838d';
      context.fill();

      // x += vx;
      y += vy;

      //  if (x > canvasRef.current.width - radius || x < radius) {
      //    vx *= -1;
      //  } else

      if (y > canvasRef.current.height - radius || y < radius) {
        vy *= -1;
      }
      move = requestAnimationFrame(drawBall);
    };
    drawBall();
    return () => {
      cancelAnimationFrame(move);
    };
  });

  return (
    <main>
      <Helmet>
        <title>Eye gymnastics</title>
        <meta name="description" content="Eye gymnastics" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Eye gymnastics</h1>
        <p className="subheading">Follow the ball with your eyes</p>
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
