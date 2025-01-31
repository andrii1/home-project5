/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef } from 'react';

import { Helmet } from 'react-helmet';
import './BreathingApp.Style.css';
import { Button } from '../../components/Button/Button.component';

const radius = 50;
let vx = 5;
let vy = 5;
let move;

export const BreathingApp = () => {
  const [directionHorizontal, setDirectionHorizontal] = useState(false);

  // const canvasRef = useRef(null);
  // useEffect(() => {
  //   const context = canvasRef.current.getContext('2d');
  //   let x = canvasRef.current.width / 2;
  //   let y = canvasRef.current.height / 2;
  //   const drawBall = () => {
  //     context.clearRect(
  //       0,
  //       0,
  //       canvasRef.current.width,
  //       canvasRef.current.height,
  //     );
  //     context.beginPath();
  //     context.arc(x, y, radius, 0, 2 * Math.PI);
  //     context.fillStyle = '#b5838d';
  //     context.fill();

  //     if (directionHorizontal) {
  //       x += vx;
  //       if (x > canvasRef.current.width - radius || x < radius) {
  //         vx *= -1;
  //       }
  //     } else if (!directionHorizontal) {
  //       y += vy;
  //       if (y > canvasRef.current.height - radius || y < radius) {
  //         vy *= -1;
  //       }
  //     }
  //     move = requestAnimationFrame(drawBall);
  //   };

  //   drawBall();

  //   return () => {
  //     cancelAnimationFrame(move);
  //   };
  // }, [directionHorizontal]);

  useEffect(() => {
    // Implementing the setInterval method
    const interval = setInterval(() => {
      setDirectionHorizontal(!directionHorizontal);
    }, 9000);

    // Clearing the interval
    return () => clearInterval(interval);
  }, [directionHorizontal]);

  // timeOut functionality
  // useEffect(() => {
  //   // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
  //   const timeoutId = setTimeout(() => {
  //     setIsRunning(false);
  //   }, 3000);

  //   // Cleanup function to clear the timeout if the component unmounts
  //   return () => clearTimeout(timeoutId);
  // }, []);

  // const handleClick = () => {
  //   setTimeout(() => {

  //   }, 3000);
  // };

  return (
    <main>
      <Helmet>
        <title>Breathing App</title>
        <meta name="description" content="Breathing app, meditation" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Breathing app</h1>
        <p className="subheading">
          Follow the ball with your eyes (
          {directionHorizontal ? 'left to right' : 'up-down'})
        </p>
        {/* <Button primary onClick={handleClick}>
          Start
        </Button> */}
      </div>
      <section className="container-tool">
        {/* <canvas
          ref={canvasRef}
          className="canvas-eye-gymnastics"
          width={window.innerWidth - 50}
          height={window.innerHeight - 200}
        >
          1
        </canvas> */}
      </section>
    </main>
  );
};
