/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './Recipes.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';

const keywords = [];

export const Recipes = () => {
  const [search, setSearch] = useState();
  const [recipesData, setRecipesData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { cityParam } = useParams();

  const fetchData = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://forkify-api.herokuapp.com/api/search?q=pizza`,
      );
      const data = await response.json();
      console.log(data);

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

  // useEffect(() => {
  //   if (cityParam) {
  //     fetch(cityParam);
  //   } else {
  //     fetch('London');
  //   }
  // }, [cityParam]);

  console.log(recipesData);

  const handleSearch = () => {
    fetchData(search);
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

  const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const recipes = recipesData?.recipes.map((recipe) => {
    return (
      <CardSimple
        title={recipe.title}
        label={recipe.publisher}
        urlImage={recipe.image_url}
        urlLabel={recipe.source_url}
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
          {/* {weatherData && !error && (
            <div className="weather-app-container">
              <h2>
                {weatherData?.name}, {weatherData?.sys?.country}
              </h2>
              <div>{getCurrentDate()}</div>
              <div className="temperature">{weatherData?.main?.temp}°C</div>
              <div className="description">
                {weatherData?.weather?.[0].main}
              </div>
              <div>Feels like {weatherData?.main?.feels_like}°C</div>
              <div className="weather-items">
                <div>
                  <p>{weatherData?.main?.grnd_level}</p>
                  <p>Ground level</p>
                </div>
                <div>
                  <p>{weatherData?.main?.pressure}</p>
                  <p>Pressure</p>
                </div>
                <div>
                  <p>{weatherData?.main?.sea_level}</p>
                  <p>Sea level</p>
                </div>
                <div>
                  <p>{weatherData?.main?.temp_max}°C</p>
                  <p>Max temperature</p>
                </div>
                <div>
                  <p>
                    {weatherData?.sys?.sunrise &&
                      getDateFromTimestamp(weatherData.sys.sunrise)}
                  </p>
                  <p>Sunrise</p>
                </div>
                <div>
                  <p>
                    {weatherData?.sys?.sunset &&
                      getDateFromTimestamp(weatherData.sys.sunset)}
                  </p>{' '}
                  <p>Sunset</p>
                </div>
                <div>
                  <p>{weatherData?.timezone}</p>
                  <p>Timezone</p>
                </div>
                <div>
                  <p>{weatherData?.visibility}</p>
                  <p>Visibility</p>
                </div>
                <div>
                  <p>{weatherData?.wind?.speed}</p>
                  <p>Wind speed</p>
                </div>
                <div>
                  <p>{weatherData?.wind?.deg}</p>
                  <p>Wind degree</p>
                </div>
                <div>
                  <span>{weatherData?.main?.humidity}%</span>
                  <p>Humidity</p>
                </div>
              </div>
            </div>
          )} */}
        </>
      )}
    </main>
  );
};
