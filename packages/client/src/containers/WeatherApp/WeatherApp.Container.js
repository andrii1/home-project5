/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './WeatherApp.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';

import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';

const keywords = [];

export const WeatherApp = () => {
  const [search, setSearch] = useState();
  const [weatherData, setWeatherData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { cityParam } = useParams();

  const fetchWeather = async (param) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API}`,
      );
      const data = await response.json();

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

  // const fetchWeatherAirPollution = async (param) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `http://api.openweathermap.org/data/2.5/air_pollution?lat=50&lon=50&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API}`,
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to fetch');
  //     }
  //     setWeatherData(data);
  //     setError(null);

  //     // setSearch('');
  //   } catch (e) {
  //     setError({ message: e.message || 'An error occured' });
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    if (cityParam) {
      fetchWeather(cityParam);
    } else {
      fetchWeather('London');
    }

    // if (navigator.geolocation) {
    //   // get the current users location
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       // save the geolocation coordinates in two variables
    //       const { latitude, longitude } = position.coords;
    //       // update the value of userlocation variable
    //       console.log({ latitude, longitude });
    //     },
    //     // if there was an error getting the users location
    //     (error1) => {
    //       console.error('Error getting user location:', error1);
    //     },
    //   );
    // }
    // // if geolocation is not supported by the users browser
    // else {
    //   console.error('Geolocation is not supported by this browser.');
    // }
  }, [cityParam]);

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

  const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  return (
    <main>
      <Helmet>
        <title>
          {cityParam ? `${capitalize(cityParam)} weather` : 'Weather App'}
        </title>
        <meta
          name="description"
          content={
            cityParam
              ? `${capitalize(cityParam)} weather, ${capitalize(
                  cityParam,
                )} feels like, ground level, pressure, sea level, max temperature, sunrise, sunset, timezone, visibility, wind speed, wind degree, humidity, air pollution, fire weather`
              : 'Detailed weather forecast'
          }
        />
      </Helmet>
      <div className="hero">
        <h1 className="hero-header">
          {cityParam ? `${capitalize(cityParam)} weather` : 'Weather App'}
        </h1>
      </div>
      <div className="search-container weather">
        <div className="search-input-container">
          <TextFormInput
            value={search}
            placeholder="Enter city"
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
          {weatherData && !error && (
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
          )}
        </>
      )}
      {keywords.length > 0 && (
        <div className="keywords-container">{keywordBadges}</div>
      )}
    </main>
  );
};
