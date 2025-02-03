/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import './BreathingTechniquesApp.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

const exerciseData = {
  '4-7-8': {
    breatheIn: 4000,
    hold: 7000,
    breatheOut: 8000,
    label: '4 7 8',
    labelWords: ['four', 'seven', 'eight'],
    keywords:
      '4 7 8 breathing technique, 478 deep breathing, 4 7 8 breathing dr weil, dr weil 4 7 8, 4 7 8 technique, 4 7 8 andrew weil, 4 7 8 breathing method benefits, breathe in for 4 seconds hold for 7, 4 7 8 yoga breathing technique',
  },
  '4-5-8': {
    breatheIn: 4000,
    hold: 5000,
    breatheOut: 8000,
    label: '4 5 8',
    labelWords: ['four', 'five', 'eight'],
    keywords:
      '4 5 8 breathing technique, 4 5 8 technique, 4 5 8 breathing method benefits, 4 5 8 yoga breathing technique',
  },
  '4-5-6': {
    breatheIn: 4000,
    hold: 5000,
    breatheOut: 6000,
    label: '4 5 6',
    labelWords: ['four', 'five', 'six'],
    keywords:
      '4 5 6 breathing technique, 4 5 6 technique, 4 5 6 breathing method benefits, 4 5 6 yoga breathing technique',
  },
  '4-6-8': {
    breatheIn: 4000,
    hold: 6000,
    breatheOut: 8000,
    label: '4 6 8',
    labelWords: ['four', 'six', 'eight'],
    keywords:
      '4 6 8 breathing technique, 4 6 8 technique, 4 6 8 breathing method benefits, 4 6 8 yoga breathing technique',
  },
  '3-7-8': {
    breatheIn: 3000,
    hold: 7000,
    breatheOut: 8000,
    label: '3 7 8',
    labelWords: ['three', 'seven', 'eight'],
    keywords:
      '3 7 8 breathing technique, 3 7 8 technique, 3 7 8 breathing method benefits, 3 7 8 yoga breathing technique',
  },
  '2-7-8': {
    breatheIn: 2000,
    hold: 7000,
    breatheOut: 8000,
    label: '2 7 8',
    labelWords: ['two', 'seven', 'eight'],
    keywords:
      '2 7 8 breathing technique, 2 7 8 technique, 2 7 8 breathing method benefits, 2 7 8 yoga breathing technique',
  },
  '3-4-5': {
    breatheIn: 3000,
    hold: 4000,
    breatheOut: 5000,
    label: '3 4 5',
    labelWords: ['three', 'four', 'five'],
    keywords:
      '3 4 5 breathing technique, 3 4 5 technique, 3 4 5 breathing method benefits, 3 4 5 yoga breathing technique',
  },
  '4-4-4': {
    breatheIn: 4000,
    hold: 4000,
    breatheOut: 4000,
    label: '4 4 4',
    labelWords: ['four', 'four', 'four'],
    keywords:
      '4 4 4 breathing technique, 444 breathing technique, 4 4 4 technique, 4 4 4 breathing method benefits, 4 4 4 yoga breathing technique',
  },
};

export const BreathingTechniquesApp = () => {
  const [count, setCount] = useState(0);
  const [exerciseDuration, setExerciseDuration] = useState(60000);
  const [exercisePart, setExercisePart] = useState(undefined);
  const [zoom, setZoom] = useState(1);
  const { typeOfExerciseParam = '4-7-8' } = useParams();

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
      }, exerciseData[typeOfExerciseParam].breatheIn);
    } else if (exercisePart === 'hold') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-out');
        setCount(1);
        // setZoom(1);
      }, exerciseData[typeOfExerciseParam].hold);
    } else if (exercisePart === 'breathe-out') {
      timeoutId = setTimeout(() => {
        setExercisePart('breathe-in');
        setCount(1);
        setZoom(1);
      }, exerciseData[typeOfExerciseParam].breatheOut);
    }

    return () => clearTimeout(timeoutId);
  }, [exercisePart, typeOfExerciseParam]);

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
        <title>{exerciseData[typeOfExerciseParam].label} Breathing App</title>
        <meta
          name="description"
          content={exerciseData[typeOfExerciseParam].keywords}
        />
      </Helmet>
      <div className="hero max-width less-margin">
        <h1 className="hero-header">
          {exerciseData[typeOfExerciseParam].label} breathing app
        </h1>
        <p className="subheading">
          Inhale through your nose for{' '}
          {exerciseData[typeOfExerciseParam].labelWords[0]} counts. Hold your
          breath for {exerciseData[typeOfExerciseParam].labelWords[1]} counts.
          Exhale through your mouth for{' '}
          {exerciseData[typeOfExerciseParam].labelWords[2]} counts.
        </p>
      </div>
      <section className="tool-container">
        <div className="tool-input">
          <div className="button-group breathing">
            <Link to="/breathing-app">
              <Button
                tertiary={typeOfExerciseParam === '4-7-8'}
                secondary={typeOfExerciseParam !== '4-7-8'}
                label="4-7-8"
              />
            </Link>
            <Link to="/breathing-app/4-5-8">
              <Button
                tertiary={typeOfExerciseParam === '4-5-8'}
                secondary={typeOfExerciseParam !== '4-5-8'}
                label="4-5-8"
              />
            </Link>
            <Link to="/breathing-app/4-5-6">
              <Button
                tertiary={typeOfExerciseParam === '4-5-6'}
                secondary={typeOfExerciseParam !== '4-5-6'}
                label="4-5-6"
              />
            </Link>
            <Link to="/breathing-app/4-6-8">
              <Button
                tertiary={typeOfExerciseParam === '4-6-8'}
                secondary={typeOfExerciseParam !== '4-6-8'}
                label="4-6-8"
              />
            </Link>
            <Link to="/breathing-app/3-7-8">
              <Button
                tertiary={typeOfExerciseParam === '3-7-8'}
                secondary={typeOfExerciseParam !== '3-7-8'}
                label="3-7-8"
              />
            </Link>
            <Link to="/breathing-app/2-7-8">
              <Button
                tertiary={typeOfExerciseParam === '2-7-8'}
                secondary={typeOfExerciseParam !== '2-7-8'}
                label="2-7-8"
              />
            </Link>
            <Link to="/breathing-app/3-4-5">
              <Button
                tertiary={typeOfExerciseParam === '3-4-5'}
                secondary={typeOfExerciseParam !== '3-4-5'}
                label="3-4-5"
              />
            </Link>
            <Link to="/breathing-app/4-4-4">
              <Button
                tertiary={typeOfExerciseParam === '4-4-4'}
                secondary={typeOfExerciseParam !== '4-4-4'}
                label="4-4-4"
              />
            </Link>
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
