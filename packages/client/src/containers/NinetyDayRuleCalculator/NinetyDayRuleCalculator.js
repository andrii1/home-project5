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
  const [staysInSchengen, setStaysInSchengen] = useState([]);
  const [isSettingDate, setIsSettingDate] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const getMonthRange = useCallback(
    (startMonthParam, endMonthParam, staysParam) => {
      const currentDate = new Date();
      const monthsArray = [];

      for (let i = startMonthParam; i <= endMonthParam; i += 1) {
        const tempDate = new Date(currentDate);
        tempDate.setMonth(tempDate.getMonth() + i);

        const month = tempDate.getMonth() + 1; // Months are 0-based
        const year = tempDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        const firstWeekdayOfMonth = getFirstWeekdayOfMonth(month, year);

        const days = Array.from({ length: daysInMonth }, (_, index) => {
          const daysUsed = calculateDaysUsedInWindow(
            new Date(year, month - 1, index + 1),
            staysParam,
          );

          return {
            id: index + 1,
            daysUsed,
            is180DaysFromToday: get180DaysFromToday(index + 1, month, year),
            isDateInStays: checkIfDateIsInStays(
              new Date(year, month - 1, index + 1),
              staysParam,
            ),
          };
        });

        monthsArray.push({
          month,
          year,
          daysInMonth,
          firstWeekdayOfMonth,
          days,
        });
      }

      return monthsArray;
    },
    [],
  );

  useEffect(() => {
    const updatedMonthRange = getMonthRange(
      startMonth,
      endMonth,
      staysInSchengen,
    );
    setMonthRange(updatedMonthRange);
  }, [startMonth, endMonth, getMonthRange, staysInSchengen]);

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

  const getCurrentDayNumber = () => {
    return new Date().getDate();
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

  // const recipes = recipesData?.recipes.map((recipe) => {
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

  const get180DaysFromToday = (day, month, year) => {
    const currentDate = new Date(); // Get current time
    const targetDate = new Date(
      year,
      month - 1,
      day,
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds(),
    );
    const differenceInTime = currentDate.getTime() - targetDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    return differenceInDays >= 180;
  };

  const calculateDaysUsedInWindow = (date, stays) => {
    const startWindow = new Date(date);
    startWindow.setDate(startWindow.getDate() - 179); // Start of the 180-day window

    let daysUsed = 0;

    stays.forEach(({ entry, exit }) => {
      const currentEntry = new Date(entry);
      const currentExit = new Date(exit);

      // If the stay is within the 180-day window, calculate the days used
      if (currentExit >= startWindow && currentEntry <= date) {
        // Adjust entry and exit if they are outside the window
        const adjustedEntry =
          currentEntry < startWindow ? startWindow : currentEntry;
        const adjustedExit = currentExit > date ? date : currentExit;

        // Count the days within the 180-day window
        daysUsed +=
          Math.floor((adjustedExit - adjustedEntry) / (1000 * 60 * 60 * 24)) +
          1;
      }
    });

    return daysUsed;
  };

  const handleSetStays = (date) => {
    console.log('date', date);

    if (!isSettingDate) {
      setStartDate(date);
      setIsSettingDate(true);
    } else if (isSettingDate) {
      setEndDate(date);
      setStaysInSchengen((prevItems) => [
        ...prevItems,
        { entry: startDate, exit: date },
      ]);
      setIsSettingDate(false);
    }

    // setStaysInSchengen([...staysInSchengen]);
    // const [staysInSchengen, setStaysInSchengen] = useState([
    //   { entry: '2024-09-01', exit: '2024-09-15' },
    //   { entry: '2024-10-05', exit: '2024-10-29' },
    //   { entry: '2025-01-10', exit: '2025-01-30' },
    //   { entry: '2025-03-15', exit: '2025-03-25' },
    // ]);
  };
  const checkIfDateIsInStays = (date, staysParam) => {
    return staysParam.some((stay) => {
      const entryDate = new Date(stay.entry);
      const exitDate = new Date(stay.exit);
      const checkDate = new Date(date);

      return checkDate >= entryDate && checkDate <= exitDate;
    });
  };

  const getDateNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const getMonthNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getMonth() + 1; // getMonth() returns 0-based index, so add 1
  };

  const getYear = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  console.log('stays', staysInSchengen);

  console.log(
    calculateDaysUsedInWindow(new Date('2025 02 25'), staysInSchengen),
  );
  console.log(new Date('2025 02 25'));
  console.log(monthRange);
  console.log('startdate', startDate);

  const showMonthRange = monthRange.map((monthItem) => {
    return (
      <div
        key={`${monthItem.month}-${monthItem.year}`}
        className="calendar-box"
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
          {monthItem.days.map((day) => {
            console.log(getDateNumber(startDate));

            console.log(getMonthNumber(startDate));
            console.log(getYear(startDate));

            return (
              <button
                key={`${day.id}-${monthItem.month}-${monthItem.year}`}
                id={`${day.id}-${monthItem.month}-${monthItem.year}`}
                type="button"
                className={`day-box ${
                  getCurrentDayNumber() === day.id &&
                  getCurrentMonth() === monthItem.month &&
                  getCurrentYear() === monthItem.year
                    ? 'today-date'
                    : ''
                } ${day.is180DaysFromToday && 'cutoff-date'} ${
                  day.isDateInStays && 'date-selected'
                } ${
                  day.id === getDateNumber(startDate) &&
                  monthItem.month === getMonthNumber(startDate) &&
                  monthItem.year === getYear(startDate) &&
                  isSettingDate
                    ? 'date-selected-first'
                    : ''
                }`}
                style={
                  day.id === 1
                    ? { gridColumnStart: monthItem.firstWeekdayOfMonth + 1 }
                    : {}
                }
                onClick={() =>
                  handleSetStays(
                    new Date(monthItem.year, monthItem.month - 1, day.id),
                  )
                }
              >
                <span className="days-number">{day.id}</span>
                <span className="days-used">
                  {day.daysUsed ? day.daysUsed : '-'}
                </span>
              </button>
            );
          })}
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
        {/* <div className="search-input-container">
          <TextFormInput
            value={search}
            placeholder="Find recipes"
            onChange={setSearch}
          />
          <Button onClick={handleSearch} primary label="Search" />
        </div> */}
      </section>
      <section className="app-result-container">
        <Button
          onClick={() => setStartMonth((prevStartMonth) => prevStartMonth - 3)}
          secondary
          label="Look behind more"
        />
        <div className="calendar-container">{showMonthRange}</div>
        <Button
          onClick={() => setEndMonth((prevEndMonth) => prevEndMonth + 3)}
          secondary
          label="Look ahead more"
        />
      </section>
    </main>
  );
};
