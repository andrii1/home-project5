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
import { Radio } from '../../components/Radio/Radio.component';

const keywords = [
  'github contribution chart',
  'github contribution graph generator',
  'github contributions not showing',
  'github contribution graph art',
  'github contributions 3d',
  'github contribution graph 3d',
];

export const GitHubStats = () => {
  const [search, setSearch] = useState();
  const [githubData, setGithubData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('2d');
  const [imgUrl, setImgUrl] = useState(undefined);

  const fetchData = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://github-contributions-api.deno.dev/${param}.json`,
      );
      const data = await response.json();

      // OCTOKIT
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

      // OCTOKIT END

      //https://github-contributions-api.deno.dev/${param}.json?from=2023-11-11

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch');
      }
      if (mode === '2d') {
        setImgUrl(`https://github-contributions-api.deno.dev/${param}.svg`);
      } else {
        setGithubData(data);
      }
      setError(null);
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setImgUrl(null);
    setGithubData(null);
    fetchData(search);
    setSearch('');
  };

  // const recipes = githubData?.recipes.map((recipe) => {
  //   return (
  //     <CardSimple
  //       title={recipe.title}
  //       label={recipe.publisher}
  //       urlImage={recipe.image_url}
  //       urlLabel={recipe.source_url}
  //       id={recipe.recipe_id}
  //     />
  //   );
  // });

  console.log(mode);

  return (
    <main className="single-app-container">
      <Helmet>
        <title>GitHub contribution chart</title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      <div className="hero">
        <h1 className="hero-header">GitHub contribution chart</h1>
      </div>
      <section className="search-container github">
        <div className="search-input-container">
          <div className="radio-group">
            <Radio
              value="2d"
              label="2d"
              onChange={(event) => setMode(event.target.value)}
              checked={mode === '2d'}
            />
            <Radio
              value="3d"
              label="3d graph"
              onChange={(event) => setMode(event.target.value)}
              checked={mode === '3d'}
            />
          </div>
          <TextFormInput
            value={search}
            placeholder="Enter GitHub username"
            onChange={setSearch}
          />
          <Button onClick={handleSearch} primary label="Create chart" />
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {githubData && !error && (
              <div>3d</div>
              // <div className="container-cards">{githubData}</div>
            )}
            {imgUrl && !error && (
              <img src={imgUrl} alt="GitHub contribution chart" width="700" />
            )}
          </>
        )}
      </section>
    </main>
  );
};
