/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './Queries.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';
import { apiURL } from '../../apiURL';
import { useUserContext } from '../../userContext';
import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';
import DropDownView from '../../components/CategoriesListDropDown/CategoriesListDropDown.component';

const keywords = [];

const daysOptions = [
  { label: '1 day', value: 1 },
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '1 month', value: 30 },
  { label: '3 months', value: 90 },
  { label: '6 months', value: 180 },
  { label: '1 year', value: 365 },
];

export const Queries = () => {
  const { user, loading: userLoading } = useUserContext();
  const [input, setInput] = useState();
  const [queries, setQueries] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState('7');
  const [orderBy, setOrderBy] = useState({
    column: 'value',
    direction: 'desc',
  });
  const navigate = useNavigate();

  const fetchQueries = useCallback(async () => {
    const params = new URLSearchParams({
      column: orderBy.column,
      direction: orderBy.direction,
    });

    // Days
    if (days) {
      params.append('days', days);
    }
    const url = `${apiURL()}/queriesMrhack?${params.toString()}`;

    setLoading(true);

    try {
      const response = await fetch(url, {
        headers: {
          token: `token ${user?.uid}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch');
      }
      setQueries(data);
      setError(null);

      // setSearch('');
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  }, [orderBy.column, orderBy.direction, days, user?.uid]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const handleUpdateQuery = (query) => {
    const updateQuery = async () => {
      const response = await fetch(`${apiURL()}/queriesMrhack/${query.id} `, {
        method: 'PATCH',
        headers: {
          token: `token ${user?.uid}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: !query.status }),
      });

      if (response.ok) {
        fetchQueries();
      }
    };

    updateQuery();
  };

  const handleSearch = () => {
    fetchQueries(input);
    setInput('');
  };

  const displayValue = (value) => {
    if (Math.trunc(value) === 100) return 'Breakout';
    return `+${Math.round(value * 100 * 100) / 100}%`;
  };

  const queriesList = queries?.map((query) => {
    return (
      <tr>
        <td className={query.status && 'line-through'}>{query.title}</td>
        <td>{displayValue(query.value)}</td>
        <td>{getDateFromTimestamp(query.created_at)}</td>
        <td>
          <input
            type="checkbox"
            checked={query.status}
            onClick={() => {
              handleUpdateQuery(query);
            }}
          />
        </td>
      </tr>
    );
  });

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate('/');
  }, [user, userLoading, navigate]);

  return (
    <main className="single-app-container queries-container">
      <Helmet>
        <title>Title</title>
        <meta
          name="description"
          content={keywords.length > 0 && keywords.join(', ')}
        />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Queries</h1>
      </header>
      <section className="app-input-container">
        <div className="search-input-container">
          {/* <TextFormInput
            value={input}
            placeholder="Find recipes"
            onChange={setInput}
          /> */}
          <DropDownView
            selectedOptionValue={days}
            className="no-line-height"
            options={daysOptions}
            onSelect={(option) => setDays(option.value)}
            showFilterIcon={false}
          />
          {/* <Button onClick={handleSearch} primary label="Search" /> */}
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-container">
            {error && <p className="error-message">{error.message}</p>}
            {queries && !error && (
              <table border="1">
                <thead>
                  <tr>
                    <th
                      onClick={() =>
                        setOrderBy((prev) => ({
                          column: 'title',
                          direction:
                            prev.column === 'title' && prev.direction === 'desc'
                              ? 'asc'
                              : 'desc',
                        }))
                      }
                    >
                      Query
                      <span className="multi-dropdown-arrow">
                        {orderBy.column === 'title' &&
                          orderBy.direction === 'desc' &&
                          '▼'}
                        {orderBy.column === 'title' &&
                          orderBy.direction === 'asc' &&
                          '▲'}
                      </span>
                    </th>
                    <th
                      onClick={() =>
                        setOrderBy((prev) => ({
                          column: 'value',
                          direction:
                            prev.column === 'value' && prev.direction === 'desc'
                              ? 'asc'
                              : 'desc',
                        }))
                      }
                    >
                      Value{' '}
                      <span className="multi-dropdown-arrow">
                        {orderBy.column === 'value' &&
                          orderBy.direction === 'desc' &&
                          '▼'}
                        {orderBy.column === 'value' &&
                          orderBy.direction === 'asc' &&
                          '▲'}
                      </span>
                    </th>
                    <th
                      onClick={() =>
                        setOrderBy((prev) => ({
                          column: 'created_at',
                          direction:
                            prev.column === 'created_at' &&
                            prev.direction === 'desc'
                              ? 'asc'
                              : 'desc',
                        }))
                      }
                    >
                      Date
                      <span className="multi-dropdown-arrow">
                        {orderBy.column === 'created_at' &&
                          orderBy.direction === 'desc' &&
                          '▼'}
                        {orderBy.column === 'created_at' &&
                          orderBy.direction === 'asc' &&
                          '▲'}
                      </span>
                    </th>
                    <th
                      onClick={() =>
                        setOrderBy((prev) => ({
                          column: 'status',
                          direction:
                            prev.column === 'status' &&
                            prev.direction === 'desc'
                              ? 'asc'
                              : 'desc',
                        }))
                      }
                    >
                      Status
                      <span className="multi-dropdown-arrow">
                        {orderBy.column === 'status' &&
                          orderBy.direction === 'desc' &&
                          '▼'}
                        {orderBy.column === 'status' &&
                          orderBy.direction === 'asc' &&
                          '▲'}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>{queriesList}</tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </main>
  );
};
