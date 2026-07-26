/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import { ContainerCta } from '../../components/ContainerCta/ContainerCta.component';
import { Badge } from '../../components/Badge/Badge.component';
import { Card } from '../../components/Card/Card.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../components/Modal/Modal.Component';

import { Dropdown } from '../../components/Dropdown/Dropdown.Component';
import TextFormTextarea from '../../components/Input/TextFormTextarea.component';
import Toast from '../../components/Toast/Toast.Component';
import Markdown from 'markdown-to-jsx';
import { Loading } from '../../components/Loading/Loading.Component';
import Rating from '../../components/Rating/Rating.component';

import { formatDuration } from '../../utils/formatDuration';
import { getFlagEmoji } from '../../utils/getFlagEmoji';

import {
  faEnvelope,
  faLink,
  faCaretUp,
  faArrowUpRightFromSquare,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faDiscord,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';
import appImage from '../../assets/images/app-placeholder.svg';
import { faHeart, faCopy } from '@fortawesome/free-regular-svg-icons';

import { apiURL } from '../../apiURL';
import './GameView.styles.css';
import { useUserContext } from '../../userContext';
import { getMostUsedWords } from '../../utils/getMostUsedWords';
import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';

export const GameView = () => {
  const { slugParam } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');
  const [id, setId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();
  const [game, setGame] = useState({});
  const [dealCodes, setDealCodes] = useState([]);
  // const [gameGameStore, setGameGameStore] = useState({});
  // const [gameGameStoreScraper, setGameGameStoreScraper] = useState(
  //   {},
  // );
  const [similarGames, setSimilarGames] = useState([]);
  const [similarGamesCountry, setSimilarGamesCountry] = useState([]);
  const [similarGamesArea, setSimilarGamesArea] = useState([]);
  const [similarGamesCity, setSimilarGamesCity] = useState([]);

  const [similarDealsFromGame, setSimilarDealsFromGame] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [searches, setSearches] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [openAddCodeForm, setOpenAddCodeForm] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [useCases, setUseCases] = useState([]);
  // const {
  //   likes: positiveLikes,
  //   allLikes: allPositiveLikes,
  //   addLike: addPositiveLike,
  //   deleteLike: deletePositiveLike,
  // } = useLikes(user, 'positiveLikes');

  // const {
  //   likes: negativeLikes,
  //   allLikes: allNegativeLikes,
  //   addLike: addNegativeLike,
  //   deleteLike: deleteNegativeLike,
  // } = useLikes(user, 'negativeLikes');

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    async function fetchSingleGame(gameId) {
      const response = await fetch(`${apiURL()}/games/${gameId}`);
      const gameResponse = await response.json();
      setGame(gameResponse[0]);
      setId(gameResponse[0].id);
    }

    fetchSingleGame(slugParam);
  }, [slugParam]);

  useEffect(() => {
    async function fetchChapters(idParam) {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL()}/chapters?game=${idParam}`);
        const data = await response.json();

        setChapters(data);
      } catch (e) {
        setError({ message: e.message || 'Failed to fetch data' });
      }
      setLoading(false);
    }

    fetchChapters(id);
  }, [id]);

  useEffect(() => {
    async function fetchSimilarGames() {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL()}/games`);
        const data = await response.json();

        const filteredData = data.filter((item) => item.id !== game.id);

        setSimilarGames(filteredData);
      } catch (e) {
        setError({ message: e.message || 'Failed to fetch data' });
      }
      setLoading(false);
    }

    fetchSimilarGames();
  }, [game.id]);

  const fetchCommentsByGameId = useCallback(async (gameId) => {
    const response = await fetch(`${apiURL()}/comments?gameId=${gameId}`);
    const commentResponse = await response.json();
    setComments(commentResponse);
  }, []);

  useEffect(() => {
    // fetchCommentsByGameId(id);
  }, [fetchCommentsByGameId, id]);

  const navigateBack = () => {
    navigate(-1);
  };

  const addComment = async (commentContent) => {
    const response = await fetch(`${apiURL()}/comments`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: commentContent,
        game_id: id,
      }),
    });
    if (response.ok) {
      fetchCommentsByGameId(id);
    }
  };

  const commentHandler = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!comment) {
      setCommentError('Comment is required!');
      setInvalidForm(true);
      setValidForm(false);
      return;
    }
    if (comment.trim().length < 5) {
      setCommentError('Comment must be more than five characters!');
      setInvalidForm(true);
      setValidForm(false);
      return;
    }

    setInvalidForm(false);
    setValidForm(true);
    addComment(comment);
    setOpenConfirmationModal(true);
    setComment('');
  };
  const getOnlyYearMonthDay = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const cardItems = similarGames.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        cardUrl={`../gameplay/games/${item.slug}`}
        title={item.title}
        urlImage={item.url_image}
        summary={item.summary}
      />
    );
  });

  const fetchFavorites = useCallback(async () => {
    const url = `${apiURL()}/favorites`;
    const response = await fetch(url, {
      headers: {
        token: `token ${user?.uid}`,
      },
    });
    const favoritesData = await response.json();

    if (Array.isArray(favoritesData)) {
      setFavorites(favoritesData);
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (gameId) => {
    const response = await fetch(`${apiURL()}/favorites`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game_id: gameId,
      }),
    });
    if (response.ok) {
      fetchFavorites();
    }
  };

  const handleDeleteBookmarks = (favoritesId) => {
    const deleteFavorites = async () => {
      const response = await fetch(`${apiURL()}/favorites/${favoritesId} `, {
        method: 'DELETE',
        headers: {
          token: `token ${user?.uid}`,
        },
      });

      if (response.ok) {
        fetchFavorites();
      }
    };

    deleteFavorites();
  };

  const toggleModal = () => {
    setOpenModal(false);
    document.body.style.overflow = 'visible';
  };

  const fetchAllRatings = useCallback(async () => {
    const url = `${apiURL()}/ratings`;
    const response = await fetch(url);
    const ratingsData = await response.json();
    setAllRatings(ratingsData);
  }, []);

  useEffect(() => {
    fetchAllRatings();
  }, [fetchAllRatings]);

  const fetchRatings = useCallback(async () => {
    const url = `${apiURL()}/ratings`;
    const response = await fetch(url, {
      headers: {
        token: `token ${user?.uid}`,
      },
    });
    const ratingsData = await response.json();

    if (Array.isArray(ratingsData)) {
      setRatings(ratingsData);
    } else {
      setRatings([]);
    }
  }, [user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const addRating = async (gameId) => {
    const response = await fetch(`${apiURL()}/ratings`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game_id: gameId,
      }),
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  const deleteRating = async (gameId) => {
    const response = await fetch(`${apiURL()}/ratings/${gameId}`, {
      method: 'DELETE',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  const copyToClipboard = (item) => {
    navigator.clipboard.writeText(item);
    setOpenToast(true);
    setAnimation('open-animation');

    setTimeout(() => {
      setAnimation('close-animation');
    }, 2000);
    setTimeout(() => {
      setOpenToast(false);
    }, 2500);
  };

  // 2️⃣ Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.miniappshub.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Games',
        item: 'https://www.miniappshub.com/games',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: game.title,
        item: `https://www.miniappshub.com/games/${game.slug}`,
      },
    ],
  };

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error</title>
          <meta name="description" content="Something went wrong" />
        </Helmet>
        <main className="error-container">
          <h2>{error.message || 'Something went wrong'}</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${game?.title} - Gameplay`}</title>
        <meta
          name="description"
          content={
            game.meta_description ||
            `${game?.title} - reviews, deals, discounts.`
          }
        />
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://www.miniappshub.com/games/${game.slug}`}
        />
        {/* Robots meta for large image preview (Google Discover) */}
        <meta name="robots" content="max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="game" />
        <meta property="og:title" content={game.title} />
        <meta property="og:description" content={game.meta_description} />
        <meta property="og:image" content={game.url_image} />
        <meta
          property="og:url"
          content={`https://www.miniappshub.com/games/${game.slug}`}
        />
        <meta property="og:site_name" content="Gameplay" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={game.title} />
        <meta name="twitter:description" content={game.meta_description} />
        <meta name="twitter:image" content={game.url_image} />

        {/* Rich content */}

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <main>
        <section className="container-appview">
          <div className="header gameplay">
            <h1 className="hero-header">{game?.title}</h1>
          </div>
          {game.url_image && (
            <div className="activity-img-container">
              <img
                className="appview-image-activities"
                alt={game.image_alt_text || game.title}
                src={game.url_image}
              />
              {game.image_credit && <span>{game.image_credit}</span>}
            </div>
          )}
          {!game.url_image && game.countryIsoCode && (
            <span className="img-emoji">
              {getFlagEmoji(game.countryIsoCode)}
            </span>
          )}
          <div className="container-cards container-cards-blog">
            {chapters?.map((chapter) => {
              return (
                <Link
                  to={`../gameplay/chapters/${chapter.slug}`}
                  className="card-blog"
                >
                  <h2>{chapter.title}</h2>
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

          {game.description && (
            <div className="container-description">
              {/* <div className="container-title">
              <h2>{game.title}</h2>
            </div> */}
              {game.summary && (
                <>
                  <h3>Summary</h3>
                  <p className="game-description main-description">
                    <Markdown>{game.summary}</Markdown>
                  </p>
                </>
              )}
              {game.description && (
                <>
                  <h3>Description</h3>
                  {game.description && (
                    <p className="game-description main-description">
                      <Markdown>{game.description}</Markdown>
                    </p>
                  )}
                  {/* {game.description_ai && (
                  <>
                    <h3>AI summary</h3>
                    <p className="game-description main-description">
                      <Markdown>{game.description_ai}</Markdown>
                    </p>
                  </>
                )} */}
                </>
              )}
              {game.whats_included && (
                <>
                  <h3>What is included</h3>
                  <p className="game-description main-description">
                    <Markdown>{game.whats_included}</Markdown>
                  </p>
                </>
              )}
              {game.whats_excluded && (
                <>
                  <h3>What is excluded</h3>
                  <p className="game-description main-description">
                    <Markdown>{game.whats_excluded}</Markdown>
                  </p>
                </>
              )}
            </div>
          )}
          {game.url_video && (
            <div className="container-description">
              <video controls width="600">
                <source src={game.url_video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="icons-apps-page">
            <span>Share it: </span>
            <FontAwesomeIcon
              icon={faLink}
              className="button-copy"
              onClick={() =>
                copyToClipboard(
                  `https://www.miniappshub.com/games/${game.slug}`,
                )
              }
            />
            <FacebookShareButton url={`/games/${game.slug}`}>
              <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.miniappshub.com/games/${game.slug}`}
              title={`Check out this game: '${game.title}'`}
              hashtags={['Games']}
            >
              <FontAwesomeIcon className="share-icon" icon={faTwitter} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={`https://www.miniappshub.com/games/${game.slug}`}
            >
              <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
            </LinkedinShareButton>
            <EmailShareButton
              subject="Check out this game!"
              body={`This game is great: '${game.title}'`}
              url={`https://www.miniappshub.com/games/${game.slug}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </EmailShareButton>
            <Toast open={openToast} overlayClass={`toast ${animation}`}>
              <span>Copied to clipboard!</span>
            </Toast>
          </div>
          {/* <ContainerCta user={user} /> */}
          {/* {similarDealsFromGame.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Other deals from {game.gameTitle} game</h2>
              <div className="container-cards small-cards">
                {cardItemsSimilarDealsFromGame}
              </div>
            </div>
          )} */}
          {similarGames.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Similar games</h2>
              <div className="container-cards small-cards">{cardItems}</div>
            </div>
          )}
          {/* {similarGamesCity.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Deals in {game.cityTitle}</h2>
              <div className="container-cards small-cards">{cardItemsCity}</div>
            </div>
          )}
          {similarGamesArea.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Deals in {game.areaTitle}</h2>
              <div className="container-cards small-cards">{cardItemsArea}</div>
            </div>
          )}
          {similarGamesCountry.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Deals in {game.countryTitle}</h2>
              <div className="container-cards small-cards">
                {cardItemsCountry}
              </div>
            </div>
          )} */}
          {/* {searches.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Related searches</h2>
              <div className="container-related-searches">{searchItems}</div>
            </div>
          )} */}
        </section>
        <Button
          className="btn-go-back"
          secondary
          label="← Go back"
          onClick={navigateBack}
        />
        <Modal title={modalTitle} open={openModal} toggle={toggleModal}>
          <Link to="/signup">
            <Button primary label="Create an account" />
          </Link>
          or
          <Link to="/login">
            <Button secondary label="Log in" />
          </Link>
        </Modal>
      </main>
    </>
  );
};
