/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useRef } from 'react';

import { Helmet } from 'react-helmet';
import './BreathingApp.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

// const radius = 50;
// let vx = 5;
// let vy = 5;
// let move;

export const BreathingApp = () => {
  const [count, setCount] = useState(0);
  const [exerciseDuration, setExerciseDuration] = useState(60000);
  const [exercisePart, setExercisePart] = useState(undefined);

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

  // useEffect(() => {
  //   // Implementing the setInterval method
  //   const interval = setInterval(() => {
  //     setDirectionHorizontal(!directionHorizontal);
  //   }, 9000);

  //   // Clearing the interval
  //   return () => clearInterval(interval);
  // }, [directionHorizontal]);

  // timeOut functionality
  // useEffect(() => {
  //   // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
  //   const timeoutId = setTimeout(() => {
  //     setIsRunning(false);
  //   }, 3000);

  //   // Cleanup function to clear the timeout if the component unmounts
  //   return () => clearTimeout(timeoutId);
  // }, []);

  const handleStart = () => {
    setTimeout(() => {
      setExercisePart('breathe-in');
      setCount(1);
    }, 0);
    // setTimeout(() => {
    //   setExercisePart('breathe-out');
    //   setCount(1);
    // }, 7000);
    setTimeout(() => {
      setExercisePart('end');
      setCount(0);
    }, exerciseDuration);
  };

  const handleStop = () => {
    setExercisePart('end');
    setCount(0);
  };

  useEffect(() => {
    let interval;
    if (exercisePart !== undefined && exercisePart !== 'end') {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [exercisePart]);

  useEffect(() => {
    let timeoutId;
    if (exercisePart === 'breathe-in') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-out');
        setCount(1);
      }, 7000);
    } else if (exercisePart === 'breathe-out') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-in');
        setCount(1);
      }, 11000);
    }

    return () => clearTimeout(timeoutId);
  }, [exercisePart]);

  const handleSelect = (value) => {
    if (value === '1min') {
      setExerciseDuration(60000);
    } else if (value === '2min') {
      setExerciseDuration(120000);
    } else if (value === '3min') {
      setExerciseDuration(180000);
    } else if (value === '5min') {
      setExerciseDuration(300000);
    } else if (value === '10min') {
      setExerciseDuration(600000);
    }
  };

  console.log(exerciseDuration);

  return (
    <main>
      <Helmet>
        <title>Breathing App</title>
        <meta name="description" content="Breathing app, meditation" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero max-width">
        <h1 className="hero-header">Breathing app</h1>
        <p className="subheading">
          Breathe in for a count of 7, then breathe out for a count of 11
        </p>
        <Dropdown
          options={['1min', '2min', '3min', '5min', '10min']}
          onSelect={handleSelect}
        />
        {exercisePart !== undefined && exercisePart !== 'end' ? (
          <Button primary onClick={handleStop}>
            Stop
          </Button>
        ) : (
          <Button primary onClick={handleStart}>
            Start
          </Button>
        )}
      </div>
      <section className="container-tool">
        {count}
        {exercisePart === 'breathe-in' && <h2>Breathe in</h2>}
        {exercisePart === 'breathe-out' && <h2>Breathe out</h2>}
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
