/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import './WeatherApp.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { UserCard } from '../../components/UserCard/UserCard.component';
import TextFormInput from '../../components/Input/TextFormInput.component';

const keywords = [
  'What is my github profile url',
  'find github email',
  'how to find github profile link',
  'github profile search',
  'github link profile',
  'profile lookup github',
  'github user finder',
];
export const WeatherApp = () => {
  const [search, setSearch] = useState();
  const [userData, setUserData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleGithubSearch = async () => {
    setLoading(true);
    const response = await fetch(`https://api.github.com/users/${search}`);
    const data = await response.json();
    if (data.status === '404') {
      setError(data.message);
      setUserData(null);
    } else {
      setUserData(data);
      setError(null);
    }
    setSearch('');
    setLoading(false);
  };

  const keywordBadges = keywords.map((keyword) => {
    return <Badge tertiary label={keyword} />;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <Helmet>
        <title>Weather App</title>
        <meta name="description" content="Weather app" />
      </Helmet>
      <div className="hero">
        <h1 className="hero-header">Weather App</h1>
      </div>
      <div className="github-profile-search-container">
        <div className="github-profile-search-input-container">
          <TextFormInput
            value={search}
            placeholder="Enter GitHub username"
            onChange={setSearch}
          />
          <Button onClick={handleGithubSearch} primary label="Search Github" />
        </div>
        {error && <p className="error-message">{error}</p>}
        {userData && <UserCard user={userData} />}
      </div>
      <div className="keywords-container">{keywordBadges}</div>
    </main>
  );
};
