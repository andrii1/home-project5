/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
import { Info } from 'lucide-react';

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

const sourcesOptions = [
  { label: 'All', value: '' },
  { label: 'Apps', value: 'apps' },
  { label: 'Not apps', value: 'not-apps' },
];

const dataSourcesOptions = [
  { label: 'All', value: '' },
  { label: 'GT', value: 'googleTrends' },
  { label: 'SC', value: 'searchConsole' },
  { label: 'KT', value: 'keywordTool' },
  { label: 'Ahrefs', value: 'ahrefs' },
];

export const Queries = () => {
  const { user, loading: userLoading } = useUserContext();
  const [input, setInput] = useState();
  const [queries, setQueries] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState('7');
  const [sites, setSites] = useState(1);
  const [orderBy, setOrderBy] = useState({
    column: 'value',
    direction: 'desc',
  });
  const [sitesOptions, setSitesOptions] = useState([]);
  const navigate = useNavigate();

  const [sources, setSources] = useState('apps');
  const [dataSources, setDataSources] = useState('googleTrends');

  useEffect(() => {
    async function fetchSites() {
      const response = await fetch(`${apiURL()}/sites`);
      const data = await response.json();
      // Build options
      const options = [
        { label: 'All', value: '' },
        ...data.map((site) => ({
          label: site.title,
          value: site.id,
        })),
      ];

      setSitesOptions(options);
    }

    fetchSites();
  }, []);

  const fetchQueries = useCallback(async () => {
    const params = new URLSearchParams({
      column: orderBy.column,
      direction: orderBy.direction,
    });

    // Site
    if (sites) {
      params.append('sites', sites);
    }

    // Days
    if (days) {
      params.append('days', days);
    }

    // Sources
    if (sources && sites === 1) {
      params.append('sources', sources);
    }

    // Data sources
    if (dataSources) {
      params.append('dataSources', dataSources);
    }

    const url = `${apiURL()}/queries?${params.toString()}`;

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
  }, [
    orderBy.column,
    orderBy.direction,
    days,
    sources,
    sites,
    dataSources,
    user?.uid,
  ]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  // console.log('sitesOptions', sitesOptions);
  // console.log('queries', queries);
  // console.log('sites', sites);

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

  const handleUpdateQueryStatus = (query) => {
    // Optimistically update immediately
    setQueries((prev) =>
      prev.map((item) =>
        item.id === query.id ? { ...item, status: !item.status } : item,
      ),
    );

    const updateQuery = async () => {
      try {
        const response = await fetch(`${apiURL()}/queries/${query.id}`, {
          method: 'PATCH',
          headers: {
            token: `token ${user?.uid}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: !query.status }),
        });

        if (!response.ok) {
          throw new Error('Failed to update');
        }
      } catch (err) {
        // Roll back if error
        setQueries((prev) =>
          prev.map((item) =>
            item.id === query.id ? { ...item, status: query.status } : item,
          ),
        );
      }
    };

    updateQuery();
  };

  const handleUpdateQueryHighlighted = (query) => {
    // Optimistically update immediately
    setQueries((prev) =>
      prev.map((item) =>
        item.id === query.id
          ? { ...item, highlighted: !item.highlighted }
          : item,
      ),
    );

    const updateQuery = async () => {
      try {
        const response = await fetch(`${apiURL()}/queries/${query.id}`, {
          method: 'PATCH',
          headers: {
            token: `token ${user?.uid}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ highlighted: !query.highlighted }),
        });

        if (!response.ok) {
          throw new Error('Failed to update');
        }
      } catch (err) {
        // Roll back if error
        setQueries((prev) =>
          prev.map((item) =>
            item.id === query.id
              ? { ...item, highlighted: query.highlighted }
              : item,
          ),
        );
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
      <div className="row tbody">
        <div
          onClick={() => {
            handleUpdateQueryHighlighted(query);
          }}
          className={`${query.status && 'line-through'} ${
            query.highlighted && 'green'
          } c-1 mobile`}
        >
          {query.title}
        </div>
        <div
          className={`${query.status && 'line-through'} ${
            query.highlighted && 'green'
          } c-1 desktop`}
        >
          {query.title}
        </div>
        <div className="c-2">{displayValue(query.value)}</div>
        <div className="c-3">{getDateFromTimestamp(query.created_at)}</div>
        <div className="c-4">
          <span
            className="icon-highlighted"
            onClick={() => {
              handleUpdateQueryHighlighted(query);
            }}
          >
            🟢
          </span>
          <input
            type="checkbox"
            checked={query.status}
            onClick={() => {
              handleUpdateQueryStatus(query);
            }}
          />
        </div>
        <div className="c-5">
          <div className={`source-box ${query.open && 'open-source-box'}`}>
            {query.source || 'no source'}
          </div>

          <Info
            size={12}
            onClick={() => {
              handleQueriesSources(query.id);
            }}
            className="icon-info"
          />
        </div>
      </div>
    );
  });

  useEffect(() => {
    if (userLoading) return;
    if (!user) return navigate('/');
  }, [user, userLoading, navigate]);

  return (
    <main className="single-app-container queries-container">
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
        <div className="queries-input-container">
          {/* <TextFormInput
            value={input}
            placeholder="Find recipes"
            onChange={setInput}
          /> */}
          <DropDownView
            selectedOptionValue={sites}
            className="no-line-height"
            options={sitesOptions}
            onSelect={(option) => setSites(option.value)}
            showFilterIcon={false}
          />
          <DropDownView
            selectedOptionValue={days}
            className="no-line-height"
            options={daysOptions}
            onSelect={(option) => setDays(option.value)}
            showFilterIcon={false}
          />
          {sites === 1 && (
            <DropDownView
              selectedOptionValue={sources}
              className="no-line-height"
              options={sourcesOptions}
              onSelect={(option) => setSources(option.value)}
              showFilterIcon={false}
            />
          )}
          <DropDownView
            selectedOptionValue={dataSources}
            className="no-line-height"
            options={dataSourcesOptions}
            onSelect={(option) => setDataSources(option.value)}
            showFilterIcon={false}
          />
          {/* <Button onClick={handleSearch} primary label="Search" /> */}
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
                  <div
                    className="c-1"
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
                  </div>
                  <div
                    className="c-2"
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
                    Value
                    <span className="multi-dropdown-arrow">
                      {orderBy.column === 'value' &&
                        orderBy.direction === 'desc' &&
                        '▼'}
                      {orderBy.column === 'value' &&
                        orderBy.direction === 'asc' &&
                        '▲'}
                    </span>
                  </div>
                  <div
                    className="c-3"
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
                  </div>
                  <div
                    className="c-4"
                    onClick={() =>
                      setOrderBy((prev) => ({
                        column: 'status',
                        direction:
                          prev.column === 'status' && prev.direction === 'desc'
                            ? 'asc'
                            : 'desc',
                      }))
                    }
                  >
                    {' '}
                    <span className="multi-dropdown-arrow">
                      {orderBy.column === 'status' &&
                        orderBy.direction === 'desc' &&
                        '▼'}
                      {orderBy.column === 'status' &&
                        orderBy.direction === 'asc' &&
                        '▲'}
                    </span>
                  </div>
                  <div className="c-5"> </div>
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
