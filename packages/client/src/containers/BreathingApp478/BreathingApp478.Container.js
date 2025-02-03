/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';
import './BreathingApp478.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

const exerciseData = {
  '4-7-8': { breatheIn: 4000, hold: 7000, breatheOut: 8000 },
  '4-5-8': { breatheIn: 4000, hold: 5000, breatheOut: 8000 },
  '4-5-6': { breatheIn: 4000, hold: 5000, breatheOut: 6000 },
  '4-6-8': { breatheIn: 4000, hold: 6000, breatheOut: 8000 },
  '3-7-8': { breatheIn: 3000, hold: 7000, breatheOut: 8000 },
  '2-7-8': { breatheIn: 2000, hold: 7000, breatheOut: 8000 },
  '3-4-5': { breatheIn: 3000, hold: 4000, breatheOut: 5000 },
  '4-4-4': { breatheIn: 4000, hold: 4000, breatheOut: 4000 },
};

export const BreathingApp478 = () => {
  const [count, setCount] = useState(0);
  const [exerciseDuration, setExerciseDuration] = useState(60000);
  const [exercisePart, setExercisePart] = useState(undefined);
  const [zoom, setZoom] = useState(1);
  const [typeOfExercise, setTypeOfExercise] = useState('4-7-8');

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
      }, exerciseData[typeOfExercise].breatheIn);
    } else if (exercisePart === 'hold') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-out');
        setCount(1);
        // setZoom(1);
      }, exerciseData[typeOfExercise].hold);
    } else if (exercisePart === 'breathe-out') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-in');
        setCount(1);
        setZoom(1);
      }, exerciseData[typeOfExercise].breatheOut);
    }

    return () => clearTimeout(timeoutId);
  }, [exercisePart, typeOfExercise]);

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
          content="4 7 8 breathing technique, 4 7 8 breathing dr weil, dr weil 4 7 8, 4 7 8 technique, 4 7 8 andrew weil, 4 7 8 breathing method benefits, breathe in for 4 seconds hold for 7, 4 7 8 yoga breathing technique"
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
          <div className="button-group breathing">
            <Button
              onClick={() => setTypeOfExercise('4-7-8')}
              tertiary={typeOfExercise === '4-7-8'}
              secondary={typeOfExercise !== '4-7-8'}
              label="4-7-8"
            />
            <Button
              onClick={() => setTypeOfExercise('4-5-8')}
              tertiary={typeOfExercise === '4-5-8'}
              secondary={typeOfExercise !== '4-5-8'}
              label="4-5-8"
            />
            <Button
              onClick={() => setTypeOfExercise('4-5-6')}
              tertiary={typeOfExercise === '4-5-6'}
              secondary={typeOfExercise !== '4-5-6'}
              label="4-5-6"
            />
            <Button
              onClick={() => setTypeOfExercise('4-6-8')}
              tertiary={typeOfExercise === '4-6-8'}
              secondary={typeOfExercise !== '4-6-8'}
              label="4-6-8"
            />
            <Button
              onClick={() => setTypeOfExercise('3-7-8')}
              tertiary={typeOfExercise === '3-7-8'}
              secondary={typeOfExercise !== '3-7-8'}
              label="3-7-8"
            />
            <Button
              onClick={() => setTypeOfExercise('2-7-8')}
              tertiary={typeOfExercise === '2-7-8'}
              secondary={typeOfExercise !== '2-7-8'}
              label="2-7-8"
            />
            <Button
              onClick={() => setTypeOfExercise('3-4-5')}
              tertiary={typeOfExercise === '3-4-5'}
              secondary={typeOfExercise !== '3-4-5'}
              label="3-4-5"
            />
            <Button
              onClick={() => setTypeOfExercise('4-4-4')}
              tertiary={typeOfExercise === '4-4-4'}
              secondary={typeOfExercise !== '4-4-4'}
              label="4-4-4"
            />
          </div>
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
