/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import './NinetyDayRuleCalculator.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';

const keywords = [];

export const NinetyDayRuleCalculator = () => {
  const [search, setSearch] = useState();
  const [recipesData, setRecipesData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [monthRange, setMonthRange] = useState([]);
  const [startMonth, setStartMonth] = useState(-6);
  const [endMonth, setEndMonth] = useState(5);

  const getMonthRange = useCallback((startMonthParam, endMonthParam) => {
    const currentDate = new Date();
    const monthsArray = [];

    for (let i = startMonthParam; i <= endMonthParam; i += 1) {
      const tempDate = new Date(currentDate);
      tempDate.setMonth(tempDate.getMonth() + i);

      const month = tempDate.getMonth() + 1; // Months are 0-based
      const year = tempDate.getFullYear();
      const daysInMonth = getDaysInMonth(month, year);
      const firstWeekdayOfMonth = getFirstWeekdayOfMonth(month, year);

      monthsArray.push({ month, year, daysInMonth, firstWeekdayOfMonth });
    }

    return monthsArray;
  }, []);

  useEffect(() => {
    setMonthRange(getMonthRange(startMonth, endMonth));
  }, [startMonth, endMonth, getMonthRange]);
  console.log(monthRange);

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
    fetchData(search);
    setSearch('');
  };

  const getDaysInMonth = (month, year) => {
    return moment(`${month}-${year}`, 'MM-YYYY').daysInMonth();
  };

  const getFirstWeekdayOfMonth = (month, year) => {
    return moment(`${month}-${year}`, 'MM-YYYY').startOf('month').weekday();
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-us', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCurrentMonth = () => {
    return new Date().getMonth() + 1;
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // Month numbers are 0-based
    return date.toLocaleString('en-us', { month: 'long' });
  };

  console.log(getDaysInMonth(getCurrentMonth(), getCurrentYear()));

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

  const showMonthRange = monthRange.map((monthItem, id) => {
    return (
      <div
        key={monthItem.month - monthItem.year}
        className="calendar-container"
      >
        <div>{`${getMonthName(monthItem.month)} ${monthItem.year}`}</div>
        <div className="weekdays-group">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>
        <div className="weekdays-boxes-group">
          <div className="day-box" style={{ gridColumnStart: 1 }}>
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
          <div className="day-box">
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
          <div className="day-box">
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
          <div className="day-box">
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
          <div className="day-box">
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
          <div className="day-box">
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
          <div className="day-box">
            <span className="day-number">1</span>
            <span className="day-quantity">-</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <main className="single-app-container">
      <Helmet>
        <title>90 day rule calculator</title>
        <meta name="description" content="Calculator 90 days from now" />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">90 day rule calculator</h1>
      </header>
      <section className="app-input-container">
        <div className="search-input-container">
          <TextFormInput
            value={search}
            placeholder="Find recipes"
            onChange={setSearch}
          />
          <Button onClick={handleSearch} primary label="Search" />
        </div>
      </section>
      <section className="app-result-container">
        <div className="calendar-container">
          <div>February 2025</div>
          <div className="weekdays-group">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>
          <div className="weekdays-boxes-group">
            <div className="day-box" style={{ gridColumnStart: 1 }}>
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
            <div className="day-box">
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
            <div className="day-box">
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
            <div className="day-box">
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
            <div className="day-box">
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
            <div className="day-box">
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
            <div className="day-box">
              <span className="day-number">1</span>
              <span className="day-quantity">-</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
