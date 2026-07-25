/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Games.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';
import { Loading } from '../../components/Loading/Loading.Component';

export const Games = () => {
  const [games, setGames] = useState([]);
  const [showAppsBy, setShowAppsBy] = useState('alphabet');

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // first fetch
  useEffect(() => {
    setIsLoading(true);
    const url = `${apiURL()}/games`;

    console.log('testeset');

    async function fetchGames() {
      const response = await fetch(url);
      const data = await response.json();
      console.log('testeset');

      setGames(data);

      setIsLoading(false);
    }

    fetchGames();
  }, []);

  console.log('games', games);

  return (
    <>
      <Helmet>
        <title>Gameplays</title>
        <meta name="description" content="Solve your games" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="container-blog">
        <header>
          <h1>Gameplays</h1>
        </header>

        {games ? (
          <section className="container-scroll">
            <div className="container-cards container-cards-blog">
              {games?.map((game) => {
                return (
                  <Link
                    to={`../gameplay/games/${game.slug}`}
                    className="card-blog"
                  >
                    <h2>{game.title}</h2>
                    {/* {game.meta_description && (
                      <div className="blog-preview">{`${game.meta_description}`}</div>
                    )}
                    <div className="date">
                      {getDateFromTimestamp(game.created_at)}
                    </div> */}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
};
