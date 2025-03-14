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
import { Radio } from '../../components/Radio/Radio.component';
import { DatePicker } from '../../components/DatePicker/DatePicker.component';

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
  const [mode, setMode] = useState('fields');
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [staysInSchengenFields, setStaysInSchengenFields] = useState([
    { entry: undefined, exit: undefined },
  ]);

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
    if (checkIfDateIsInStays(date, staysInSchengen)) {
      setStaysInSchengen((prevStays) =>
        prevStays.filter(({ entry, exit }) => {
          const entryDate = new Date(entry);
          const exitDate = new Date(exit);
          const checkDate = new Date(date);

          return checkDate < entryDate || checkDate > exitDate;
        }),
      );
      return;
    }
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

  /// FIELDS PART

  const getDaysBetweenDates = (date1, date2) => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    const timeDifference = Math.abs(secondDate - firstDate); // Difference in milliseconds
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days
  };

  const getDaysInLast180 = (stays) => {
    const today = new Date();
    const past180Days = new Date();
    past180Days.setDate(today.getDate() - 180);

    return stays.reduce((totalDays, stay) => {
      const entryDate = new Date(stay.entry);
      const exitDate = new Date(stay.exit);

      if (exitDate >= past180Days) {
        const validEntry = entryDate >= past180Days ? entryDate : past180Days;
        // eslint-disable-next-line no-param-reassign
        totalDays += getDaysBetweenDates(validEntry, exitDate);
      }
      return totalDays;
    }, 0);
  };

  const getLastPossibleStayDate = (stays) => {
    const today = new Date();
    const totalDays = getDaysInLast180(stays);
    const remainingDays = 90 - totalDays;

    if (remainingDays <= 0) return 'No more days left in the period';

    const lastStayDate = new Date(today);
    lastStayDate.setDate(today.getDate() + remainingDays);

    return lastStayDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  const handleSetStaysFields = (startDateParam, endDateParam) => {
    if (
      checkIfDateIsInStays(startDateParam, staysInSchengenFields) ||
      checkIfDateIsInStays(endDateParam, staysInSchengenFields)
    ) {
      // setStaysInSchengen((prevStays) =>
      //   prevStays.filter(({ entry, exit }) => {
      //     const entryDate = new Date(entry);
      //     const exitDate = new Date(exit);
      //     const checkDate = new Date(startDateParam);

      //     return checkDate < entryDate || checkDate > exitDate;
      //   }),
      // );
      return;
    }
    setStaysInSchengenFields((prevItems) => [
      ...prevItems,
      { entry: startDateParam, exit: endDateParam },
    ]);
    // setStartDate(undefined);
    // setEndDate(undefined);
  };

  const hasUndefinedEntryOrExit = staysInSchengenFields.some(
    (item) => item.entry === undefined || item.exit === undefined,
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!hasUndefinedEntryOrExit) {
      setInvalidForm(false);
      setValidForm(true);
    } else {
      setInvalidForm(true);
      setValidForm(false);
    }
  };

  const handleInputChange = (id, identifier, value) => {
    setValidForm(false);
    setStaysInSchengenFields((prevItems) =>
      prevItems.map((item, index) =>
        index === id ? { ...item, [identifier]: value } : item,
      ),
    );
  };

  const handleRemove = (id) => {
    setStaysInSchengenFields((prevItems) =>
      prevItems.filter((_, index) => index !== id),
    );
  };

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
                onClick={() => {
                  if (day.is180DaysFromToday) return;
                  handleSetStays(
                    new Date(monthItem.year, monthItem.month - 1, day.id),
                  );
                }}
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
    <main className="single-app-container ninety-day-rule">
      <Helmet>
        <title>90 day rule calculator</title>
        <meta name="description" content="Calculator 90 days from now" />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">90 day rule calculator</h1>
      </header>
      <section className="app-input-container">
        {' '}
        <div className="input-group">
          <Radio
            value="calendar"
            label="Calendar"
            onChange={(event) => setMode(event.target.value)}
            checked={mode === 'calendar'}
          />
          <Radio
            value="fields"
            label="Fields"
            onChange={(event) => setMode(event.target.value)}
            checked={mode === 'fields'}
          />
        </div>
      </section>
      <section className="app-result-container">
        {mode === 'calendar' && (
          <>
            <Button
              onClick={() =>
                setStartMonth((prevStartMonth) => prevStartMonth - 3)
              }
              secondary
              label="Look behind more"
            />
            <div className="calendar-container">{showMonthRange}</div>
            <Button
              onClick={() => setEndMonth((prevEndMonth) => prevEndMonth + 3)}
              secondary
              label="Look ahead more"
            />
            <Button
              onClick={() => setStaysInSchengen([])}
              secondary
              label="Reset"
              className="danger"
            />
          </>
        )}
        {mode === 'fields' && (
          <div className="form-box submit-box-90day">
            <form onSubmit={handleSubmit}>
              <div
                className={`form-ninety-day-rule-header-container ${
                  staysInSchengenFields.length > 1 && 'add-cell'
                }`}
              >
                <div>Entry date</div>
                <div>Exit date</div>
                <div>Duration (days)</div>
                {staysInSchengenFields.length > 1 && <div />}
              </div>
              {staysInSchengenFields.map((stay, id) => {
                return (
                  <div
                    className={`form-ninety-day-rule-row-container ${
                      staysInSchengenFields.length > 1 && 'add-cell'
                    }`}
                  >
                    <DatePicker
                      className="empty"
                      onChange={(event) => {
                        handleInputChange(id, 'entry', event.target.value);
                      }}
                    />
                    <DatePicker
                      className="empty"
                      onChange={(event) => {
                        handleInputChange(id, 'exit', event.target.value);
                      }}
                    />
                    <div>
                      {stay.entry && stay.exit
                        ? getDaysBetweenDates(stay.entry, stay.exit)
                        : '-'}
                    </div>
                    {staysInSchengenFields.length > 1 && (
                      <div>
                        <Button
                          onClick={() => handleRemove(id)}
                          secondary
                          label="X"
                          className="danger"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="result-container">
                <div>
                  Days of Stay in the Last 180 Days{' '}
                  {validForm && (
                    <strong>{getDaysInLast180(staysInSchengenFields)}</strong>
                  )}
                </div>
                <div>
                  Last Day to Stay{' '}
                  {validForm && (
                    <strong>
                      {getLastPossibleStayDate(staysInSchengenFields)}
                    </strong>
                  )}
                </div>
              </div>
              <div className="button-90days-group">
                <Button
                  type="button"
                  secondary
                  className="btn-add-prompt"
                  label="Add dates"
                  onClick={() => {
                    setStaysInSchengenFields((prevItems) => [
                      ...prevItems,
                      { entry: undefined, exit: undefined },
                    ]);
                  }}
                />
                <Button
                  type="submit"
                  primary
                  className="btn-add-prompt"
                  label="Calculate"
                />
              </div>
              <div className="btn-reset-group">
                <Button
                  onClick={() =>
                    setStaysInSchengenFields([
                      { entry: undefined, exit: undefined },
                    ])
                  }
                  secondary
                  label="Reset"
                  className="danger"
                />
              </div>
              {invalidForm && (
                <p className="error-message">Form is not valid</p>
              )}
            </form>
          </div>
        )}
      </section>
    </main>
  );
};
