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
import { ThumbsUp, ThumbsDown, Globe } from 'lucide-react';
import Rating from '../../components/Rating/Rating.component';
import globe from '../../assets/images/globe.svg';
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
import './ChapterView.styles.css';
import { useUserContext } from '../../userContext';
import { getMostUsedWords } from '../../utils/getMostUsedWords';
import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';

export const ChapterView = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [topicsFromChapters, setTopicsFromChapters] = useState([]);
  const navigate = useNavigate();
  const [chapter, setChapter] = useState({});
  const [dealCodes, setDealCodes] = useState([]);
  // const [chapterChapterStore, setChapterChapterStore] = useState({});
  // const [chapterChapterStoreScraper, setChapterChapterStoreScraper] = useState(
  //   {},
  // );
  const [similarChapters, setSimilarChapters] = useState([]);
  const [similarChaptersCountry, setSimilarChaptersCountry] = useState([]);
  const [similarChaptersArea, setSimilarChaptersArea] = useState([]);
  const [similarChaptersCity, setSimilarChaptersCity] = useState([]);

  const [similarDealsFromChapter, setSimilarDealsFromChapter] = useState([]);
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
  const [occasions, setOccasions] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchSingleChapter(chapterId) {
      const response = await fetch(`${apiURL()}/chapters/${chapterId}`);
      const chapterResponse = await response.json();
      setChapter(chapterResponse[0]);
    }

    fetchSingleChapter(id);
  }, [id]);

  useEffect(() => {
    async function fetchTagsForChapter(chapterId) {
      const response = await fetch(`${apiURL()}/tags/?chapter=${chapterId}`);
      const data = await response.json();
      setTags(data);
    }

    async function fetchQuestionsForChapter(chapterId) {
      const response = await fetch(
        `${apiURL()}/questions/?chapter=${chapterId}`,
      );
      const data = await response.json();
      setQuestions(data);
    }

    async function fetchOccasionsForChapter(chapterId) {
      const response = await fetch(
        `${apiURL()}/occasions/?chapter=${chapterId}`,
      );
      const data = await response.json();
      setOccasions(data);
    }

    async function fetchHighlightsForChapter(chapterId) {
      const response = await fetch(
        `${apiURL()}/highlights/?chapter=${chapterId}`,
      );
      const data = await response.json();
      setHighlights(data);
    }

    async function fetchUseCasesForChapter(chapterId) {
      const response = await fetch(
        `${apiURL()}/useCases/?chapter=${chapterId}`,
      );
      const data = await response.json();
      setUseCases(data);
    }

    async function fetchUserTypesForChapter(chapterId) {
      const response = await fetch(
        `${apiURL()}/userTypes/?chapter=${chapterId}`,
      );
      const data = await response.json();
      setUserTypes(data);
    }

    // async function fetchCodesForADeal(dealId) {
    //   const response = await fetch(`${apiURL()}/codes/?deal=${dealId}`);
    //   const chapterResponse = await response.json();
    //   setDealCodes(chapterResponse);
    // }

    // async function fetchSearchesForADeal(dealId) {
    //   const response = await fetch(`${apiURL()}/searches/?deal=${dealId}`);
    //   const chapterResponse = await response.json();
    //   setSearches(chapterResponse);
    // }

    // async function fetchKeywordsForADeal(dealId) {
    //   const response = await fetch(`${apiURL()}/keywords/?deal=${dealId}`);
    //   const chapterResponse = await response.json();
    //   setKeywords(chapterResponse);
    // }

    // fetchSingleChapter(id);
    // fetchCodesForADeal(id);
    // fetchSearchesForADeal(id);
    // fetchKeywordsForADeal(id);

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        await fetchQuestionsForChapter(id);
        // await fetchTagsForChapter(id);
        // await fetchOccasionsForChapter(id);
        // await fetchHighlightsForChapter(id);

        // await fetchUseCasesForChapter(id);
        // await fetchUserTypesForChapter(id);
        // await fetchCodesForADeal(id);
        // await fetchSearchesForADeal(id);
        // await fetchKeywordsForADeal(id);
      } catch (e) {
        setError({ message: e.message || 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchSimilarChapters() {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL()}/chapters`);
        const data = await response.json();

        const filteredData = data.filter((item) => item.id !== chapter.id);

        setSimilarChapters(filteredData);
      } catch (e) {
        setError({ message: e.message || 'Failed to fetch data' });
      }
      setLoading(false);
    }

    fetchSimilarChapters();
  }, [
    chapter.id,
    chapter.categorySlug,
    chapter.countrySlug,
    chapter.citySlug,
    chapter.areaSlug,
  ]);

  const fetchCommentsByChapterId = useCallback(async (chapterId) => {
    const response = await fetch(`${apiURL()}/comments?chapterId=${chapterId}`);
    const commentResponse = await response.json();
    setComments(commentResponse);
  }, []);

  useEffect(() => {
    fetchCommentsByChapterId(id);
  }, [fetchCommentsByChapterId, id]);

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
        chapter_id: id,
      }),
    });
    if (response.ok) {
      fetchCommentsByChapterId(id);
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

  const cardItems = similarChapters.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        cardUrl={`/chapters/${item.slug}`}
        title={item.title}
        price={item.price}
        currency={item.currency}
        urlAffiliate={item.url_affiliate}
        description={item.description}
        url={item.url}
        urlImage={item.url_image}
        topic={item.categoryTitle}
        chapterTitle={item.chapterTitle}
        rating={item.rating}
        reviews={item.reviews}
        isoCode={item.countryIsoCode}
        smallCard
      />
    );
  });

  const searchItems = searches.map((search) => {
    return (
      <Link to={`../../chapters/searchterm/${search.id}`} target="_blank">
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

  const addFavorite = async (chapterId) => {
    const response = await fetch(`${apiURL()}/favorites`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapter_id: chapterId,
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

  const addRating = async (chapterId) => {
    const response = await fetch(`${apiURL()}/ratings`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapter_id: chapterId,
      }),
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  const deleteRating = async (chapterId) => {
    const response = await fetch(`${apiURL()}/ratings/${chapterId}`, {
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

  const discount = chapter.discount_percentage || 0;

  // Calculate original price
  const originalPrice =
    discount > 0 ? chapter.price / (1 - discount / 100) : chapter.price;

  const descriptionText = (
    chapter.description ||
    chapter.summary ||
    chapter.description_ai ||
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

  const chapterSchema = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: chapter.title,
    image: chapter.url_image,
    description: descriptionText,
    sku: chapter.id,
    brand: {
      '@type': 'Brand',
      name: 'Book Travel Activities',
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.booktravelactivities.com/chapters/${chapter.slug}`,
      priceCurrency: chapter.currency,
      price: chapter.price,
      priceValidUntil,
      itemCondition: 'https://schema.org/NewCondition',
      availability: `https://schema.org/InStock`,
    },
    ...(chapter.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: chapter.rating,
        reviewCount: chapter.reviews || 0,
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
        item: 'https://www.booktravelactivities.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Chapters',
        item: 'https://www.booktravelactivities.com/chapters',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: chapter.title,
        item: `https://www.booktravelactivities.com/chapters/${chapter.slug}`,
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

  const isBestseller = Boolean(Number(chapter.bestseller));

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
        <title>{`${chapter?.title} - Book Travel Activities`}</title>
        <meta
          name="description"
          content={
            chapter.meta_description ||
            `${chapter?.title} - reviews, deals, discounts.`
          }
        />
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://www.booktravelactivities.com/chapters/${chapter.slug}`}
        />
        {/* Robots meta for large image preview (Google Discover) */}
        <meta name="robots" content="max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="chapter" />
        <meta property="og:title" content={chapter.title} />
        <meta
          property="og:description"
          content={chapter.meta_description || descriptionText}
        />
        <meta property="og:image" content={chapter.url_image} />
        <meta
          property="og:url"
          content={`https://www.booktravelactivities.com/chapters/${chapter.slug}`}
        />
        <meta property="og:site_name" content="Book Travel Activities" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={chapter.title} />
        <meta
          name="twitter:description"
          content={chapter.meta_description || descriptionText}
        />
        <meta name="twitter:image" content={chapter.url_image} />

        {/* Rich content */}
        <script type="application/ld+json">
          {JSON.stringify(chapterSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <main>
        <section className="container-appview">
          <div className="header gameplay">
            <h1 className="hero-header">{chapter?.title} gameplay</h1>
          </div>
          {chapter.url_image && (
            <div className="activity-img-container">
              <img
                className="appview-image-activities"
                alt={chapter.image_alt_text || chapter.title}
                src={chapter.url_image}
              />
              {chapter.image_credit && <span>{chapter.image_credit}</span>}
            </div>
          )}
          {!chapter.url_image && chapter.countryIsoCode && (
            <span className="img-emoji">
              {getFlagEmoji(chapter.countryIsoCode)}
            </span>
          )}

          {/* {chapter.url_image && (
            <div
              style={{
                backgroundImage: `url(${chapter.url_image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            ></div>
          )} */}
          {/* {chapter.url_image && (
            <img
              className="appview-icon default-icon"
              alt={`${chapter.title}`}
              src={chapter.url_image || mousePointer}
            />
          )} */}
          {/* <span className="img-emoji">🌍</span>
          <Globe size="15rem" className="appview-icon default-icon" /> */}

          {/* <img
            className={`appview-icon ${!chapter.url_icon && 'default-icon'}`}
            alt={`${chapter.title}`}
            src={chapter.url_icon || mousePointer}
          /> */}

          {/* <ImageGallery items={images} /> */}

          <div className="container-deal-actions">
            {/* <div className="container-appview-buttons">
              {chapter.url_affiliate && (
                <Link to={chapter.url_affiliate} target="_blank">
                  <Button
                    fourth
                    size="large"
                    icon={
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        size="sm"
                      />
                    }
                    label="Book Now"
                  />
                </Link>
              )}
            </div> */}
            <div className="container-rating">
              Rating
              {user &&
              allRatings.some((rating) => rating.chapter_id === chapter.id) &&
              ratings.some((rating) => rating.id === chapter.id) ? (
                <button
                  type="button"
                  className="button-rating"
                  onClick={(event) => deleteRating(chapter.id)}
                >
                  <FontAwesomeIcon icon={faCaretUp} />
                  {
                    allRatings.filter(
                      (rating) => rating.chapter_id === chapter.id,
                    ).length
                  }
                </button>
              ) : user ? (
                <button
                  type="button"
                  className="button-rating"
                  onClick={(event) => addRating(chapter.id)}
                >
                  <FontAwesomeIcon icon={faCaretUp} />
                  {
                    allRatings.filter(
                      (rating) => rating.chapter_id === chapter.id,
                    ).length
                  }
                </button>
              ) : (
                <button
                  type="button"
                  className="button-rating"
                  onClick={() => {
                    setOpenModal(true);
                    setModalTitle('Sign up to vote');
                  }}
                >
                  <FontAwesomeIcon icon={faCaretUp} />
                  {
                    allRatings.filter(
                      (rating) => rating.chapter_id === chapter.id,
                    ).length
                  }
                </button>
              )}
            </div>

            <div>
              {user && favorites.some((x) => x.id === chapter.id) ? (
                <button
                  type="button"
                  onClick={() => handleDeleteBookmarks(chapter.id)}
                  onKeyDown={() => handleDeleteBookmarks(chapter.id)}
                  className="button-bookmark"
                >
                  Remove chapter from saved &nbsp;
                  <FontAwesomeIcon icon={faHeartSolid} size="lg" />
                </button>
              ) : user ? (
                <button
                  type="button"
                  onClick={() => addFavorite(chapter.id)}
                  onKeyDown={() => addFavorite(chapter.id)}
                  className="button-bookmark"
                >
                  Save this chapter &nbsp;
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(true);
                    setModalTitle('Sign up to add bookmarks');
                  }}
                  onKeyDown={() => addFavorite(chapter.id)}
                  className="button-bookmark"
                >
                  Save <FontAwesomeIcon icon={faHeart} size="lg" />
                </button>
              )}
            </div>
          </div>
          {/* <div className="container-details container-badges">
            <h2 className="no-margin">Pricing</h2>
            <div className="container-tags">
              <div className="badges">
                <div className="badges-keywords">
                  {!!chapter.pricing_free && (
                    <Link to="../chapters/pricing/free">
                      <Button secondary label="free" size="small" />
                    </Link>
                  )}
                  {!!chapter.pricing_freemium && (
                    <Link to="../chapters/pricing/freemium">
                      <Button secondary label="freemium" size="small" />
                    </Link>
                  )}
                  {!!chapter.pricing_subscription && (
                    <Link to="../chapters/pricing/subscription">
                      <Button secondary label="subscription" size="small" />
                    </Link>
                  )}
                  {!!chapter.pricing_one_time && (
                    <Link to="../chapters/pricing/one-time">
                      <Button secondary label="one-time" size="small" />
                    </Link>
                  )}
                  {!!chapter.pricing_trial_available && (
                    <Link to="../chapters/pricing/trial">
                      <Button secondary label="trial" size="small" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="container-tags">
              <div className="badges">
                <p className="p-no-margin">iOS chapter: </p>
                <div className="badges-keywords">
                  {!!chapter.pricing_ios_chapter_free && (
                    <Link to="../chapters/pricing/ios-free">
                      <Button secondary label="free" size="small" />
                    </Link>
                  )}
                  {!!chapter.pricing_ios_chapter_paid && (
                    <Link to="../chapters/pricing/ios-paid">
                      <Button secondary label="paid" size="small" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {!!chapter.pricing_ios_chapter_paid &&
              chapter.price > 0 &&
              `${chapter.price} ${chapter.currency}`}
            {chapter.pricing_details && (
              <p className="p-no-margin">{chapter.pricing_details}</p>
            )}
            {chapter.pricing_url && (
              <div>
                <Link target="_blank" to={chapter.pricing_url}>
                  <span className="underline">Pricing page</span>{' '}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />
                </Link>
              </div>
            )}
          </div> */}
          {/* <div className="container-description">
            <div className="container-title">
              <h2>{chapter.title}</h2>
            </div>
            {chapter.summary && (
              <>
                <h3>Summary</h3>
                <p className="chapter-description main-description">
                  <Markdown>{chapter.summary}</Markdown>
                </p>
              </>
            )}
            {(chapter.description || chapter.description_ai) && (
              <>
                <h3>Description</h3>
                {chapter.description && (
                  <p className="chapter-description main-description">
                    <Markdown>{chapter.description}</Markdown>
                  </p>
                )}
                {chapter.description_ai && (
                  <>
                    <h3>AI summary</h3>
                    <p className="chapter-description main-description">
                      <Markdown>{chapter.description_ai}</Markdown>
                    </p>
                  </>
                )}
              </>
            )}
            {chapter.whats_included && (
              <>
                <h3>What is included</h3>
                <p className="chapter-description main-description">
                  <Markdown>{chapter.whats_included}</Markdown>
                </p>
              </>
            )}
            {chapter.whats_excluded && (
              <>
                <h3>What is excluded</h3>
                <p className="chapter-description main-description">
                  <Markdown>{chapter.whats_excluded}</Markdown>
                </p>
              </>
            )}
          </div> */}

          <div className="container-codes">
            {questions.length > 0 ? (
              <>
                <div className="container-title">
                  <h2>
                    {chapter.title} - {questions.length} questions
                  </h2>
                </div>

                <div className="container-appview-codes-users">
                  {questions.map((question) => {
                    return (
                      <div className="container-codes-users">
                        <div className="container-appview-codes">
                          <span>Question {question.question_id}.</span>
                          <div>
                            {question.answers?.map((answer) => {
                              return (
                                <>
                                  {' '}
                                  <Button
                                    size="medium"
                                    primary
                                    icon={<FontAwesomeIcon icon={faCopy} />}
                                    label={answer.title}
                                    onClick={() =>
                                      copyToClipboard(answer.title)
                                    }
                                  />
                                  <Toast
                                    open={openToast}
                                    overlayClass={`toast ${animation}`}
                                  >
                                    <span>Copied to clipboard!</span>
                                  </Toast>
                                  {answer.id && (
                                    <Link to={answer.id} target="_blank">
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
                                  <Link
                                    to={`../../questions/${answer.id}`}
                                    target="_blank"
                                  >
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
                                  <span className="codes-added-by">
                                    by {answer.userFullName}
                                  </span>
                                </>
                              );
                            })}

                            {/* <div className="container-rating">
                            {user &&
                            positiveLikes.some(
                              (like) => like.id === question.id,
                            ) ? (
                              <div className="thumbs-container up">
                                <ThumbsUp
                                  className="thumbs"
                                  color="green"
                                  size={20}
                                  onClick={() =>
                                    deletePositiveLike(question.id)
                                  }
                                />
                                {positiveLikesCount}
                              </div>
                            ) : user ? (
                              <div className="thumbs-container up">
                                <ThumbsUp
                                  color="green"
                                  className="thumbs"
                                  size={20}
                                  onClick={() => addPositiveLike(question.id)}
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
                              (like) => like.id === question.id,
                            ) ? (
                              <div className="thumbs-container down">
                                <ThumbsDown
                                  className="thumbs"
                                  color="red"
                                  size={20}
                                  onClick={() =>
                                    deleteNegativeLike(question.id)
                                  }
                                />
                                {negativeLikesCount}
                              </div>
                            ) : user ? (
                              <div className="thumbs-container down">
                                <ThumbsDown
                                  color="red"
                                  className="thumbs"
                                  size={20}
                                  onClick={() => addNegativeLike(question.id)}
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
                          </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="container-title">
                <span>
                  <i>No questions yet</i> 😢 <i>Add your question now!</i>
                </span>
              </div>
            )}
          </div>
          {/* {!user && (
            <div className="container-details cta">
              <div>
                <h2>🔥 Add your chapter!</h2>
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
            <h2 className="h-no-margin h-no-margin-bottom">Comments</h2>
            {comments.length === 0 && (
              <div>
                <i>No comments yet. </i>
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
                  to add comments
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
                      placeholder="Your comment..."
                      onChange={commentHandler}
                    />

                    <Button
                      primary
                      className="btn-add-prompt"
                      type="submit"
                      label="Add comment"
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

          <div className="container-details container-badges">
            <h2 className="no-margin">Taxonomy</h2>
            <div className="container-tags">
              <div className="badges">
                <p>Game: </p>
                <div>
                  <Link to={`../gameplay/games/${chapter.gameSlug}`}>
                    <Button
                      secondary
                      label={chapter.gameTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {/* {topicsFromChapters.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Related topics: </p>
                  <div className="badges-keywords">
                    {topicsFromChapters.map((topic, index) => (
                      <Link to={`../../${topic.url}`}>
                        <Button secondary label={topic.title} size="small" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )} */}
            {tags.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Tags: </p>
                  <div className="badges-keywords">
                    {tags.map((tag) => (
                      <Link to={`../chapters/tags/${tag.slug}`}>
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
          </div>

          {/* <div className="container-related-searches">
            <h3>Related searches</h3>
            <div className="topics-div searches">
              {searches.map((search) => (
                <Link to={`/chapters/search/${search.id}`} target="_blank">
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
                  `https://www.booktravelactivities.com/chapters/${chapter.slug}`,
                )
              }
            />
            <FacebookShareButton url={`/chapters/${chapter.slug}`}>
              <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.booktravelactivities.com/chapters/${chapter.slug}`}
              title={`Check out this chapter: '${chapter.title}'`}
              hashtags={['Chapters']}
            >
              <FontAwesomeIcon className="share-icon" icon={faTwitter} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={`https://www.booktravelactivities.com/chapters/${chapter.slug}`}
            >
              <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
            </LinkedinShareButton>
            <EmailShareButton
              subject="Check out this chapter!"
              body={`This chapter is great: '${chapter.title}'`}
              url={`https://www.booktravelactivities.com/chapters/${chapter.slug}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </EmailShareButton>
            <Toast open={openToast} overlayClass={`toast ${animation}`}>
              <span>Copied to clipboard!</span>
            </Toast>
          </div>
          {/* <ContainerCta user={user} /> */}
          {/* {similarDealsFromChapter.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Other deals from {chapter.chapterTitle} chapter</h2>
              <div className="container-cards small-cards">
                {cardItemsSimilarDealsFromChapter}
              </div>
            </div>
          )} */}
          {similarChapters.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Other chapters in {chapter.categoryTitle}</h2>
              <div className="container-cards small-cards">{cardItems}</div>
            </div>
          )}

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
