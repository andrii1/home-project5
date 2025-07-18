/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './Template.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';

const keywords = [];

export const Template = () => {
  const [input, setInput] = useState();
  const [recipesData, setRecipesData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

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

  const handleSearch = () => {
    fetchData(input);
    setInput('');
  };

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
        <title>Title</title>
        <meta
          name="description"
          content={keywords.length > 0 && keywords.join(', ')}
        />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Recipes app</h1>
      </header>
      <section className="app-input-container">
        <div className="search-input-container">
          <TextFormInput
            value={input}
            placeholder="Find recipes"
            onChange={setInput}
          />
          <Button onClick={handleSearch} primary label="Search" />
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {recipesData && !error && (
              <div className="container-cards">{recipes}</div>
            )}
          </>
        )}
      </section>
    </main>
  );
};
