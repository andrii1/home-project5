/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './QueriesTrends.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';
import { apiURL } from '../../apiURL';
import { useUserContext } from '../../userContext';
import DropDownView from '../../components/CategoriesListDropDown/CategoriesListDropDown.component';
import { Info } from 'lucide-react';

const keywords = [];

const daysOptions = [
  { label: '1 day', value: 1 },
  { label: '7 days', value: 7 },
];

export const QueriesTrends = () => {
  const { user, loading: userLoading } = useUserContext();
  const [input, setInput] = useState();
  const [queries, setQueries] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState('7');

  const navigate = useNavigate();

  const fetchQueries = async () => {
    if (!user) return;
    const params = new URLSearchParams({
      days,
    });

    const url = `${apiURL()}/queriesTrends?${params.toString()}`;

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
      const queriesArray = data.map((item) => ({ ...item, open: false }));
      setQueries(queriesArray);
      setError(null);

      // setSearch('');
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   fetchQueries();
  // }, [fetchQueries]);

  // useEffect(() => {
  //   const sourcesArray = queries.map((query) => ({
  //     id: query.id,
  //     source: query.source,
  //     open: false,
  //   }));

  //   setSources(sourcesArray);
  // }, [queries]);

  const handleQueriesSources = (queryId) => {
    setQueries(
      queries.map((item) => {
        if (item.id === queryId) {
          return { ...item, open: !item.open };
        }
        return item;
      }),
    );
  };

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
    fetchQueries();
    setInput('');
  };

  const displayValue = (value) => {
    if (Math.trunc(value) === 100) return 'Breakout';
    return `+${Math.round(value * 100 * 100) / 100}%`;
  };

  const queriesList = queries?.map((query) => {
    return (
      <div className="row tbody">
        <div className={`${query.status && 'line-through'} c-1`}>
          {query.title}
        </div>
        <div className="c-2">{displayValue(query.value)}</div>
        <div className="c-3">{query.source}</div>
      </div>
    );
  });

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate('/');
  }, [user, userLoading, navigate]);

  return (
    <main className="single-app-container queries-container queries-trends-container">
      <Helmet>
        <title>Queries</title>
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

          <Button onClick={handleSearch} primary label="Get queries" />
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {queries && !error && (
              <div className="queries-table">
                <div className="row header">
                  <div className="c-1">Query</div>
                  <div className="c-2">Value</div>
                  <div className="c-3">Source</div>
                </div>
                {queriesList}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};
