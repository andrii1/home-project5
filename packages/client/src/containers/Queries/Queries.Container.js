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

const keywords = [];

export const Queries = () => {
  const { user, loading: userLoading } = useUserContext();
  const [input, setInput] = useState();
  const [queries, setQueries] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const url = `${apiURL()}/queriesMrhack`;
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
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    fetchData(input);
    setInput('');
  };

  const displayValue = (value) => {
    if (Math.trunc(value) === 100) return 'Breakout';
    return `+${Math.round(value * 100 * 100) / 100}%`;
  };

  const queriesList = queries?.map((query) => {
    return (
      <tr>
        <td>{query.title}</td>
        <td>{displayValue(query.value)}</td>
        <td>{getDateFromTimestamp(query.created_at)}</td>
        <td>{query.status}</td>
      </tr>
    );
  });

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate('/');
  }, [user, userLoading, navigate]);

  console.log(queries);

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
          <TextFormInput
            value={input}
            placeholder="Find recipes"
            onChange={setInput}
          />
          <Button onClick={handleSearch} primary label="Search" />
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {queries && !error && (
              <table border="1" cellSpacing="0" cellPadding="8">
                <thead>
                  <tr>
                    <th>Query</th>
                    <th>Value</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{queriesList}</tbody>
              </table>
            )}
          </>
        )}
      </section>
    </main>
  );
};
