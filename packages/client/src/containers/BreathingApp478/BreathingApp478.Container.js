/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';
import './BreathingApp478.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

export const BreathingApp478 = () => {
  const [count, setCount] = useState(0);
  const [exerciseDuration, setExerciseDuration] = useState(60000);
  const [exercisePart, setExercisePart] = useState(undefined);
  const [zoom, setZoom] = useState(1);

  // Start exercise
  const handleStart = () => {
    setTimeout(() => {
      setExercisePart('breathe-in');
      setCount(1);
    }, 0);

    setTimeout(() => {
      setExercisePart('end');
      setCount(0);
      setZoom(1);
    }, exerciseDuration);
  };

  // End exercise
  const handleStop = () => {
    setExercisePart('end');
    setCount(0);
    setZoom(1);
  };

  // Counter
  useEffect(() => {
    let interval;
    if (exercisePart !== undefined && exercisePart !== 'end') {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [exercisePart]);

  // Circle's zoom
  useEffect(() => {
    let interval;
    if (exercisePart !== undefined && exercisePart !== 'end') {
      interval = setInterval(() => {
        if (exercisePart === 'breathe-in') {
          setZoom((prevZoom) => prevZoom + 0.01);
        } else if (exercisePart === 'breathe-out') {
          setZoom((prevZoom) => prevZoom - 0.01);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [exercisePart]);

  // Exercise parts
  useEffect(() => {
    let timeoutId;
    if (exercisePart === 'breathe-in') {
      timeoutId = setTimeout(() => {
        setExercisePart('hold');
        setCount(1);
      }, 4000);
    } else if (exercisePart === 'hold') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-out');
        setCount(1);
        // setZoom(1);
      }, 7000);
    } else if (exercisePart === 'breathe-out') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-in');
        setCount(1);
        setZoom(1);
      }, 8000);
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

  const styles = {
    transform: `scale(${zoom})`,
  };

  return (
    <main>
      <Helmet>
        <title>4-7-8 Breathing App</title>
        <meta
          name="description"
          content="4 7 8 breathing technique, 4 7 8 breathing dr weil"
        />
      </Helmet>
      <div className="hero max-width less-margin">
        <h1 className="hero-header">4-7-8 breathing app</h1>
        <p className="subheading">
          Inhale through your nose for four counts. Hold your breath for seven
          counts. Exhale through your mouth for eight counts.
        </p>
      </div>
      <section className="tool-container">
        <div className="tool-input">
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
        <div className="tool-result">
          <p className="text-breathing-count">{count}</p>
          {exercisePart === 'breathe-in' && <p>Breathe in</p>}
          {exercisePart === 'hold' && <p>Hold</p>}
          {exercisePart === 'breathe-out' && <p>Breathe out</p>}
          <div style={styles} className="circle" />
        </div>
      </section>
    </main>
  );
};
