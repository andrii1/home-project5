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

    fetchChapters();
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
        cardUrl={`/games/${item.slug}`}
        title={item.title}
        urlImage={item.url_image}
        summary={item.summary}
      />
    );
  });

  const cardItemsCountry = similarGamesCountry.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        cardUrl={`/games/${item.slug}`}
        title={item.title}
        price={item.price}
        currency={item.currency}
        urlAffiliate={item.url_affiliate}
        description={item.description}
        url={item.url}
        urlImage={item.url_image}
        topic={item.categoryTitle}
        gameTitle={item.gameTitle}
        rating={item.rating}
        reviews={item.reviews}
        isoCode={item.countryIsoCode}
      />
    );
  });

  const cardItemsArea = similarGamesArea.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        cardUrl={`/games/${item.slug}`}
        title={item.title}
        price={item.price}
        currency={item.currency}
        urlAffiliate={item.url_affiliate}
        description={item.description}
        url={item.url}
        urlImage={item.url_image}
        topic={item.categoryTitle}
        gameTitle={item.gameTitle}
        rating={item.rating}
        reviews={item.reviews}
        isoCode={item.countryIsoCode}
      />
    );
  });

  const cardItemsCity = similarGamesCity.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        cardUrl={`/games/${item.slug}`}
        title={item.title}
        price={item.price}
        currency={item.currency}
        urlAffiliate={item.url_affiliate}
        description={item.description}
        url={item.url}
        urlImage={item.url_image}
        topic={item.categoryTitle}
        gameTitle={item.gameTitle}
        rating={item.rating}
        reviews={item.reviews}
        isoCode={item.countryIsoCode}
      />
    );
  });

  // const cardItemsSimilarDealsFromGame = similarDealsFromGame.map((item) => {
  //   return (
  //     <Card
  //       id={item.id}
  //       cardUrl={`/games/${item.id}`}
  //       title={item.title}
  //       description={item.description}
  //       url={item.url}
  //       urlImage={item.url_image === null ? 'deal' : item.url_image}
  //       topic={item.topicTitle}
  //       gameTitle={item.gameTitle}
  //       smallCard
  //     />
  //   );
  // });

  const searchItems = searches.map((search) => {
    return (
      <Link to={`../../games/searchterm/${search.id}`} target="_blank">
        <Button
          size="medium"
          secondary
          icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />}
          label={search.title}
        />
      </Link>
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

  const dealCodesInTitle = dealCodes.map((i) => {
    return `(${i.title})`;
  });

  const showNumberOfCodesInTitle = (codes) => {
    let title;
    if (codes.length === 1) {
      title = 'code';
    } else {
      title = 'codes';
    }

    return `${codes.length} ${title}`;
  };

  // const images = [
  //   {
  //     original: 'https://picsum.photos/id/1018/1000/600/',
  //     thumbnail: 'https://picsum.photos/id/1018/250/150/',
  //   },
  //   {
  //     original: 'https://picsum.photos/id/1015/300/600/',
  //     thumbnail: 'https://picsum.photos/id/1015/150/450/',
  //   },
  //   {
  //     original: 'https://picsum.photos/id/1019/1000/600/',
  //     thumbnail: 'https://picsum.photos/id/1019/250/150/',
  //   },
  // ];

  // if (loading) {
  //   return (
  //     <>
  //       <Helmet>
  //         <title>Loading...</title>
  //         <meta name="description" content="Fetching deal details" />
  //       </Helmet>
  //       <main className="loading-container">
  //         <Loading />
  //       </main>
  //     </>
  //   );
  // }

  const handleFaqs = (faqId) => {
    setFaqs(
      faqs.map((item) => {
        if (item.id === faqId) {
          return { ...item, open: !item.open };
        }
        return item;
      }),
    );
  };

  const discount = game.discount_percentage || 0;

  // Calculate original price
  const originalPrice =
    discount > 0 ? game.price / (1 - discount / 100) : game.price;

  const descriptionText = (
    game.description ||
    game.summary ||
    game.description_ai ||
    'No description available'
  )
    .replace(/\*+/g, '')
    .trim();

  function getPriceValidUntil(days = 30) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // usage
  const priceValidUntil = getPriceValidUntil(30);

  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: game.title,
    image: game.url_image,
    description: descriptionText,
    sku: game.id,
    brand: {
      '@type': 'Brand',
      name: 'Catch Top Deals',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.catchtopdeals.com/games/${game.slug}`,
      priceCurrency: game.currency,
      price: game.price,
      priceValidUntil,
      itemCondition: 'https://schema.org/NewCondition',
      availability: `https://schema.org/InStock`,
    },
    ...(game.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: game.rating,
        reviewCount: game.reviews || 0,
      },
    }),
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
        item: 'https://www.catchtopdeals.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Games',
        item: 'https://www.catchtopdeals.com/games',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: game.title,
        item: `https://www.catchtopdeals.com/games/${game.slug}`,
      },
    ],
  };

  const faqsItems = faqs.map((faq) => {
    return (
      <div key={faq.id}>
        <h3 className="h3-faq" onClick={() => handleFaqs(faq.id)}>
          {faq.title} {faq.open ? '▲' : '▼'}
        </h3>
        <p className={!faq.open && 'faq-closed'}>{faq.text}</p>
      </div>
    );
  });

  const isBestseller = Boolean(Number(game.bestseller));

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
        <title>{`${game?.title} - Catch Top Deals`}</title>
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
          href={`https://www.catchtopdeals.com/games/${game.slug}`}
        />
        {/* Robots meta for large image preview (Google Discover) */}
        <meta name="robots" content="max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="game" />
        <meta property="og:title" content={game.title} />
        <meta
          property="og:description"
          content={game.meta_description || descriptionText}
        />
        <meta property="og:image" content={game.url_image} />
        <meta
          property="og:url"
          content={`https://www.catchtopdeals.com/games/${game.slug}`}
        />
        <meta property="og:site_name" content="Catch Top Deals" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={game.title} />
        <meta
          name="twitter:description"
          content={game.meta_description || descriptionText}
        />
        <meta name="twitter:image" content={game.url_image} />

        {/* Rich content */}
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
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

          <div className="container-cards container-cards-blog">
            {chapters?.map((chapter) => {
              return (
                <Link
                  to={`../gameplay/chapters/${chapter.id}`}
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

          {/* <div className="container-codes">
            {dealCodes.length > 0 ? (
              <>
                <div className="container-title">
                  <h2>
                    {game.title} -{' '}
                    {dealCodes.length > 0
                      ? `${showNumberOfCodesInTitle(dealCodes)}`
                      : ''}
                  </h2>
                </div>

                <div className="container-appview-codes-users">
                  {dealCodes.map((code) => {
                    const positiveLikesCount = allPositiveLikes.filter(
                      (like) => like.code_id === code.id,
                    ).length;

                    const negativeLikesCount = allNegativeLikes.filter(
                      (like) => like.code_id === code.id,
                    ).length;

                    return (
                      <div className="container-codes-users">
                        <div className="container-appview-codes">
                          <Button
                            size="medium"
                            primary
                            icon={<FontAwesomeIcon icon={faCopy} />}
                            label={code.title}
                            onClick={() => copyToClipboard(code.title)}
                          />
                          <Toast
                            open={openToast}
                            overlayClass={`toast ${animation}`}
                          >
                            <span>Copied to clipboard!</span>
                          </Toast>
                          {code.url && (
                            <Link to={code.url} target="_blank">
                              <Button
                                size="medium"
                                secondary
                                icon={
                                  <FontAwesomeIcon
                                    icon={faArrowUpRightFromSquare}
                                    size="sm"
                                  />
                                }
                                label="Link"
                              />
                            </Link>
                          )}
                          <Link to={`../../codes/${code.id}`} target="_blank">
                            <Button
                              size="medium"
                              secondary
                              icon={
                                <FontAwesomeIcon
                                  icon={faArrowUpRightFromSquare}
                                  size="sm"
                                />
                              }
                              label="View"
                            />
                          </Link>
                          <div className="container-rating">
                            {user &&
                            positiveLikes.some(
                              (like) => like.id === code.id,
                            ) ? (
                              <div className="thumbs-container up">
                                <ThumbsUp
                                  className="thumbs"
                                  color="green"
                                  size={20}
                                  onClick={() => deletePositiveLike(code.id)}
                                />
                                {positiveLikesCount}
                              </div>
                            ) : user ? (
                              <div className="thumbs-container up">
                                <ThumbsUp
                                  color="green"
                                  className="thumbs"
                                  size={20}
                                  onClick={() => addPositiveLike(code.id)}
                                />
                                {positiveLikesCount}
                              </div>
                            ) : (
                              <div className="thumbs-container up">
                                <ThumbsUp
                                  className="thumbs"
                                  size={20}
                                  color="green"
                                  onClick={() => {
                                    setOpenModal(true);
                                    setModalTitle('Sign up to vote');
                                  }}
                                />
                                {positiveLikesCount}
                              </div>
                            )}
                          </div>
                          <div className="container-rating">
                            {user &&
                            negativeLikes.some(
                              (like) => like.id === code.id,
                            ) ? (
                              <div className="thumbs-container down">
                                <ThumbsDown
                                  className="thumbs"
                                  color="red"
                                  size={20}
                                  onClick={() => deleteNegativeLike(code.id)}
                                />
                                {negativeLikesCount}
                              </div>
                            ) : user ? (
                              <div className="thumbs-container down">
                                <ThumbsDown
                                  color="red"
                                  className="thumbs"
                                  size={20}
                                  onClick={() => addNegativeLike(code.id)}
                                />
                                {negativeLikesCount}
                              </div>
                            ) : (
                              <div className="thumbs-container down">
                                <ThumbsDown
                                  className="thumbs"
                                  size={20}
                                  color="red"
                                  onClick={() => {
                                    setOpenModal(true);
                                    setModalTitle('Sign up to vote');
                                  }}
                                />
                                {negativeLikesCount}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="codes-added-by">
                          added by {code.userFullName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="container-title">
                <span>
                  <i>No codes yet</i> 😢 <i>Add your code now!</i>
                </span>
              </div>
            )}
          </div> */}
          {/* {!user && (
            <div className="container-details cta">
              <div>
                <h2>🔥 Add your game!</h2>
                <p>Create an account to get started for free</p>
              </div>
              <div>
                <Link target="_blank" to="/signup">
                  <Button primary label="Create my account 👌" />
                </Link>
              </div>
            </div>
          )} */}
          <div className="container-comments">
            <h2 className="h-no-margin h-no-margin-bottom">Reviews</h2>
            {comments.length === 0 && (
              <div>
                <i>No reviews yet. </i>
                {user && <i>Add a first one below.</i>}
              </div>
            )}
            {comments.length > 0 &&
              comments.map((item) => (
                <div className="form-container">
                  <div className="comment-box submit-box-new-comment">
                    <div>{item.content}</div>
                    <div className="comment-author-date">{`by ${
                      item.full_name
                    } on ${getOnlyYearMonthDay(item.created_at)}`}</div>
                  </div>
                </div>
              ))}
            {!user && (
              <div>
                <i>
                  <br />
                  <Link to="/signup" className="simple-link">
                    Sign up
                  </Link>{' '}
                  or{' '}
                  <Link to="/login" className="simple-link">
                    log in
                  </Link>{' '}
                  to add reviews
                </i>
              </div>
            )}
            {user && (
              <div className="form-container">
                <div className="comment-box submit-box">
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="form-input textarea-new-comment"
                      value={comment}
                      placeholder="Your review..."
                      onChange={commentHandler}
                    />

                    <Button
                      primary
                      className="btn-add-prompt"
                      type="submit"
                      label="Add review"
                    />
                    {validForm && (
                      <Modal
                        title="Your comment has been submitted!"
                        open={openConfirmationModal}
                        toggle={() => setOpenConfirmationModal(false)}
                      />
                    )}
                    {invalidForm && (
                      <p className="error-message">{commentError}</p>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
          {/* <div className="container-details container-badges">
            <h2 className="no-margin">Reviews</h2>
          </div> */}
          {/* <div className="container-details container-badges">
            <h2 className="no-margin">Additional info</h2>
            {game.duration && (
              <div className="container-tags">
                <div className="badges">
                  <p>Duration: </p>
                  <div>{formatDuration(game.duration)}</div>
                </div>
              </div>
            )}
            {game.wheelchair_access && (
              <div className="container-tags">
                <div className="badges">
                  <p>Wheelchair access: </p>
                  <div>{game.wheelchair_access ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            {game.smartphone_ticket && (
              <div className="container-tags">
                <div className="badges">
                  <p>Smartphone ticket: </p>
                  <div>{game.smartphone_ticket ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            {game.private_tour !== undefined && (
              <div className="container-tags">
                <div className="badges">
                  <p>Private tour: </p>
                  <div>{game.private_tour ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            {game.free_cancellation !== undefined && (
              <div className="container-tags">
                <div className="badges">
                  <p>Free cancellation: </p>
                  <div>{game.free_cancellation ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            {game.likely_to_sell_out !== undefined && (
              <div className="container-tags">
                <div className="badges">
                  <p>Likely to sell out: </p>
                  <div>{game.likely_to_sell_out ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            {game.instant_confirmation !== undefined && (
              <div className="container-tags">
                <div className="badges">
                  <p>Instant confirmation: </p>
                  <div>{game.instant_confirmation ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
          </div> */}
          {/* <div className="container-details container-badges">
            <h2 className="no-margin">Location</h2>
            {game.address && (
              <div className="container-tags">
                <div className="badges">
                  <p>Address: </p>
                  <div>{game.address}</div>
                </div>
              </div>
            )}
            {game.postal_code && (
              <div className="container-tags">
                <div className="badges">
                  <p>Postal code: </p>
                  <div>{game.postal_code}</div>
                </div>
              </div>
            )}
            {(game.geolocation_lat || game.geolocation_lng) && (
              <>
                {game.geolocation_lat && (
                  <div className="container-tags">
                    <div className="badges">
                      <p>Latitude: </p>
                      <div>{game.geolocation_lat}</div>
                    </div>
                  </div>
                )}
                {game.geolocation_lng && (
                  <div className="container-tags">
                    <div className="badges">
                      <p>Longitude: </p>
                      <div>{game.geolocation_lng}</div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="container-tags">
              <div className="badges">
                <p>Country: </p>
                <div>
                  <Link to={`/games/countries/${game.countrySlug}`}>
                    <Button
                      secondary
                      label={game.countryTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {game.areaSlug && (
              <div className="container-tags">
                <div className="badges">
                  <p>Region/Area: </p>
                  <div>
                    <Link to={`/games/areas/${game.areaSlug}`}>
                      <Button
                        secondary
                        label={game.areaTitle?.toLowerCase()}
                        size="small"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <div className="container-tags">
              <div className="badges">
                <p>City: </p>
                <div>
                  <Link to={`/games/cities/${game.citySlug}`}>
                    <Button
                      secondary
                      label={game.cityTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="container-details container-badges">
            <h2 className="no-margin">Taxonomy</h2>
            <div className="container-tags">
              <div className="badges">
                <p>Platform: </p>
                <div>
                  <Link to={`/games/platforms/${game.platformSlug}`}>
                    <Button
                      secondary
                      label={game.platformTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="container-tags">
              <div className="badges">
                <p>Category: </p>
                <div>
                  <Link to={`/games/categories/${game.categorySlug}`}>
                    <Button
                      secondary
                      label={game.categoryTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {topicsFromGames.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Related topics: </p>
                  <div className="badges-keywords">
                    {topicsFromGames.map((topic, index) => (
                      <Link to={`../../${topic.url}`}>
                        <Button secondary label={topic.title} size="small" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Tags: </p>
                  <div className="badges-keywords">
                    {tags.map((tag) => (
                      <Link to={`../games/tags/${tag.slug}`}>
                        <Button
                          secondary
                          label={tag.title.toLowerCase()}
                          size="small"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div> */}
          {/* <div className="container-details container-badges">
            <h2 className="no-margin">Highlights & use cases</h2>
            {highlights.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Highlights: </p>
                  <div className="badges-keywords">
                    {highlights.map((tag) => (
                      <Link to={`../games/highlights/${tag.slug}`}>
                        <Button
                          secondary
                          label={tag.title.toLowerCase()}
                          size="small"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {useCases.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Use cases: </p>
                  <div className="badges-keywords">
                    {useCases.map((tag) => (
                      <Link to={`../games/useCases/${tag.slug}`}>
                        <Button
                          secondary
                          label={tag.title.toLowerCase()}
                          size="small"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {/* <div className="container-related-searches">
            <h3>Related searches</h3>
            <div className="topics-div searches">
              {searches.map((search) => (
                <Link to={`/games/search/${search.id}`} target="_blank">
                  <Button secondary label={search.title} />
                </Link>
              ))}
            </div>
          </div> */}
          <div className="icons-apps-page">
            <span>Share it: </span>
            <FontAwesomeIcon
              icon={faLink}
              className="button-copy"
              onClick={() =>
                copyToClipboard(
                  `https://www.catchtopdeals.com/games/${game.slug}`,
                )
              }
            />
            <FacebookShareButton url={`/games/${game.slug}`}>
              <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.catchtopdeals.com/games/${game.slug}`}
              title={`Check out this game: '${game.title}'`}
              hashtags={['Games']}
            >
              <FontAwesomeIcon className="share-icon" icon={faTwitter} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={`https://www.catchtopdeals.com/games/${game.slug}`}
            >
              <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
            </LinkedinShareButton>
            <EmailShareButton
              subject="Check out this game!"
              body={`This game is great: '${game.title}'`}
              url={`https://www.catchtopdeals.com/games/${game.slug}`}
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
