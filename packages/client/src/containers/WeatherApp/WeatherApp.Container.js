/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
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
  const [weatherData, setWeatherData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API}`,
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch');
      }
      setWeatherData(data);
      setError(null);

      // setSearch('');
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather('London');
  }, []);

  const handleSearch = () => {
    fetchWeather(search);
    setSearch('');
  };

  const keywordBadges = keywords.map((keyword) => {
    return <Badge tertiary label={keyword} />;
  });
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-us', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
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
            placeholder="Enter city"
            onChange={setSearch}
          />
          <Button onClick={handleSearch} primary label="Search" />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {weatherData && !error && (
              <div className="weather-app-container">
                <h2>
                  {weatherData?.name}, {weatherData?.sys?.country}
                </h2>
                <div>{getCurrentDate()}</div>
                <div>{weatherData?.main?.temp}</div>
                <div>{weatherData?.weather?.[0].main}</div>
                <div>
                  <p>{weatherData?.wind?.speed}</p>
                  <p>Wind speed</p>
                </div>
                <div>
                  <span>{weatherData?.main?.humidity}</span>
                  <p>Humidity</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="keywords-container">{keywordBadges}</div>
    </main>
  );
};
