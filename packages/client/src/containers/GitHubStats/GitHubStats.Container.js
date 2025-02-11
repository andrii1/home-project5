/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './GitHubStats.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';
import { Octokit } from '@octokit/rest';

const keywords = [];
const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_API,
});

export const GitHubStats = () => {
  const [search, setSearch] = useState();
  const [recipesData, setRecipesData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://github-contributions-api.deno.dev/andrii1.svg?from=2023-11-11`,
      );
      const data = await response.json();
      // const { data } = await octokit.request('/user');

      // const { data } = octokit.request(
      //   'GET /repos/{owner}/{repo}/stats/commit_activity',
      //   {
      //     owner: 'OWNER',
      //     repo: 'REPO',
      //     headers: {
      //       'X-GitHub-Api-Version': '2022-11-28',
      //     },
      //   },
      // );

      // const { data } = await octokit.request('/events');
      console.log(data);

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to fetch');
      // }
      // setRecipesData(data);
      setError(null);

      // setSearch('');
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchData(search);
    setSearch('');
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
    <main>
      <Helmet>
        <title>Recipes App</title>
        <meta name="description" content="Find amazing recipes" />
      </Helmet>
      <div className="hero">
        <h1 className="hero-header">Recipes app</h1>
      </div>
      <div className="search-container weather">
        <div className="search-input-container">
          <TextFormInput
            value={search}
            placeholder="Find recipes"
            onChange={setSearch}
          />
          <Button onClick={handleSearch} primary label="Search" />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p className="error-message">{error.message}</p>}
          {recipesData && !error && (
            <div className="container-cards">{recipes}</div>
          )}
        </>
      )}
    </main>
  );
};
