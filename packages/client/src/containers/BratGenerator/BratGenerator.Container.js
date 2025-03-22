/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
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

  const fetchData = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://forkify-api.herokuapp.com/api/search?q=${param}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch');
      }
      setRecipesData(data);
      setError(null);

      // setSearch('');
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  // const handleInput = () => {
  //   fetchData(input);
  //   setInput('');
  // };

  const recipes = recipesData?.recipes.map((recipe) => {
    return (
      <CardSimple
        title={recipe.title}
        label={recipe.publisher}
        urlImage={recipe.image_url}
        urlLabel={recipe.source_url}
        id={recipe.recipe_id}
      />
    );
  });

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
                className="color-input"
                style={{ backgroundColor: item }}
                onClick={() => setColor(item)}
              />
            ))}
          </div>
          {/* <Button onClick={handleInput} primary label="Search" /> */}
        </div>
      </section>
      <section className="app-result-container">
        <div className="brat-wrapper">
          <div className="brat-container" style={{ backgroundColor: color }} />
          <div className="brat-text">{input}</div>
        </div>
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
