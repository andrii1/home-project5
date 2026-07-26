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
import './QuestionView.styles.css';
import { useUserContext } from '../../userContext';
import { getMostUsedWords } from '../../utils/getMostUsedWords';
import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';

export const QuestionView = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [topicsFromQuestions, setTopicsFromQuestions] = useState([]);
  const navigate = useNavigate();
  const [question, setQuestion] = useState({});
  const [dealCodes, setDealCodes] = useState([]);
  // const [questionQuestionStore, setQuestionQuestionStore] = useState({});
  // const [questionQuestionStoreScraper, setQuestionQuestionStoreScraper] = useState(
  //   {},
  // );
  const [similarQuestions, setSimilarQuestions] = useState([]);
  const [similarQuestionsCountry, setSimilarQuestionsCountry] = useState([]);
  const [similarQuestionsArea, setSimilarQuestionsArea] = useState([]);
  const [similarQuestionsCity, setSimilarQuestionsCity] = useState([]);

  const [similarDealsFromQuestion, setSimilarDealsFromQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answerError, setAnswerError] = useState(null);
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
    async function fetchSingleQuestion(questionId) {
      const response = await fetch(`${apiURL()}/questions/${questionId}`);
      const questionResponse = await response.json();
      setQuestion(questionResponse[0]);
    }

    fetchSingleQuestion(id);
  }, [id]);

  useEffect(() => {
    async function fetchTagsForQuestion(questionId) {
      const response = await fetch(`${apiURL()}/tags/?question=${questionId}`);
      const data = await response.json();
      setTags(data);
    }

    async function fetchQuestionsForQuestion(questionId) {
      const response = await fetch(
        `${apiURL()}/questions/?question=${questionId}`,
      );
      const data = await response.json();
      setQuestions(data);
    }

    async function fetchOccasionsForQuestion(questionId) {
      const response = await fetch(
        `${apiURL()}/occasions/?question=${questionId}`,
      );
      const data = await response.json();
      setOccasions(data);
    }

    async function fetchHighlightsForQuestion(questionId) {
      const response = await fetch(
        `${apiURL()}/highlights/?question=${questionId}`,
      );
      const data = await response.json();
      setHighlights(data);
    }

    async function fetchUseCasesForQuestion(questionId) {
      const response = await fetch(
        `${apiURL()}/useCases/?question=${questionId}`,
      );
      const data = await response.json();
      setUseCases(data);
    }

    async function fetchUserTypesForQuestion(questionId) {
      const response = await fetch(
        `${apiURL()}/userTypes/?question=${questionId}`,
      );
      const data = await response.json();
      setUserTypes(data);
    }

    // async function fetchCodesForADeal(dealId) {
    //   const response = await fetch(`${apiURL()}/codes/?deal=${dealId}`);
    //   const questionResponse = await response.json();
    //   setDealCodes(questionResponse);
    // }

    // async function fetchSearchesForADeal(dealId) {
    //   const response = await fetch(`${apiURL()}/searches/?deal=${dealId}`);
    //   const questionResponse = await response.json();
    //   setSearches(questionResponse);
    // }

    // async function fetchKeywordsForADeal(dealId) {
    //   const response = await fetch(`${apiURL()}/keywords/?deal=${dealId}`);
    //   const questionResponse = await response.json();
    //   setKeywords(questionResponse);
    // }

    // fetchSingleQuestion(id);
    // fetchCodesForADeal(id);
    // fetchSearchesForADeal(id);
    // fetchKeywordsForADeal(id);

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        await fetchQuestionsForQuestion(id);
        // await fetchTagsForQuestion(id);
        // await fetchOccasionsForQuestion(id);
        // await fetchHighlightsForQuestion(id);

        // await fetchUseCasesForQuestion(id);
        // await fetchUserTypesForQuestion(id);
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
    async function fetchSimilarQuestions() {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiURL()}/questions?chapter=${question.chapterId}`,
        );
        const data = await response.json();

        const filteredData = data.filter((item) => item.id !== question.id);

        setSimilarQuestions(filteredData);
      } catch (e) {
        setError({ message: e.message || 'Failed to fetch data' });
      }
      setLoading(false);
    }

    fetchSimilarQuestions();
  }, [question.id, question.chapterId]);

  const fetchAnswersByQuestionId = useCallback(async (questionId) => {
    const response = await fetch(`${apiURL()}/answers?question=${questionId}`);
    const answerResponse = await response.json();
    setAnswers(answerResponse);
  }, []);

  useEffect(() => {
    fetchAnswersByQuestionId(id);
  }, [fetchAnswersByQuestionId, id]);

  const navigateBack = () => {
    navigate(-1);
  };

  const addAnswer = async (answerContent) => {
    const response = await fetch(`${apiURL()}/answers`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: answerContent,
        question_id: id,
      }),
    });
    if (response.ok) {
      fetchAnswersByQuestionId(id);
    }
  };

  const answerHandler = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!answer) {
      setAnswerError('Answer is required!');
      setInvalidForm(true);
      setValidForm(false);
      return;
    }
    if (answer.trim().length < 5) {
      setAnswerError('Answer must be more than five characters!');
      setInvalidForm(true);
      setValidForm(false);
      return;
    }

    setInvalidForm(false);
    setValidForm(true);
    addAnswer(answer);
    setOpenConfirmationModal(true);
    setAnswer('');
  };
  const getOnlyYearMonthDay = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const cardItems = similarQuestions.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        cardUrl={`../gameplay/questions/${item.question_id}`}
        title={`Question ${item.question_id}`}
        smallCard
      />
    );
  });

  const searchItems = searches.map((search) => {
    return (
      <Link to={`../../questions/searchterm/${search.id}`} target="_blank">
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

  const addFavorite = async (questionId) => {
    const response = await fetch(`${apiURL()}/favorites`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questionId,
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

  const addRating = async (questionId) => {
    const response = await fetch(`${apiURL()}/ratings`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questionId,
      }),
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  const deleteRating = async (questionId) => {
    const response = await fetch(`${apiURL()}/ratings/${questionId}`, {
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

  const discount = question.discount_percentage || 0;

  // Calculate original price
  const originalPrice =
    discount > 0 ? question.price / (1 - discount / 100) : question.price;

  const descriptionText = (
    question.description ||
    question.summary ||
    question.description_ai ||
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
        name: 'Questions',
        item: 'https://www.miniappshub.com/questions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: question.title,
        item: `https://www.miniappshub.com/questions/${question.slug}`,
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

  const isBestseller = Boolean(Number(question.bestseller));

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
        <title>{`Question ${question?.question_id}, ${question?.chapterTitle}, ${question?.gameTitle} - Gameplay`}</title>
        <meta
          name="description"
          content={
            question.meta_description ||
            `${question?.title} - reviews, deals, discounts.`
          }
        />
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://www.miniappshub.com/questions/${question.slug}`}
        />
        {/* Robots meta for large image preview (Google Discover) */}
        <meta name="robots" content="max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="question" />
        <meta property="og:title" content={question.title} />
        <meta
          property="og:description"
          content={question.meta_description || descriptionText}
        />
        <meta property="og:image" content={question.url_image} />
        <meta
          property="og:url"
          content={`https://www.miniappshub.com/questions/${question.slug}`}
        />
        <meta property="og:site_name" content="Gameplay" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={question.title} />
        <meta
          name="twitter:description"
          content={question.meta_description || descriptionText}
        />
        <meta name="twitter:image" content={question.url_image} />

        {/* Rich content */}

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <main>
        <section className="container-appview">
          <div className="header gameplay">
            <h1 className="hero-header">
              Question {question?.question_id}, {question?.chapterTitle},{' '}
              {question?.gameTitle} gameplay
            </h1>
          </div>
          {question.url_image && (
            <div className="activity-img-container">
              <img
                className="appview-image-activities"
                alt={question.image_alt_text || question.title}
                src={question.url_image}
              />
              {question.image_credit && <span>{question.image_credit}</span>}
            </div>
          )}
          {!question.url_image && question.countryIsoCode && (
            <span className="img-emoji">
              {getFlagEmoji(question.countryIsoCode)}
            </span>
          )}

          <div className="container-comments">
            <h2 className="h-no-margin h-no-margin-bottom">Answers</h2>
            {answers.length === 0 && (
              <div>
                <i>No answers yet. </i>
                {user && <i>Add a first one below.</i>}
              </div>
            )}
            {answers.length > 0 &&
              answers.map((item) => (
                <div className="form-container">
                  <div className="comment-box submit-box-new-comment">
                    <div>{item.title}</div>
                    <div className="comment-author-date">{`by ${
                      item.fullName.split(' ')[0]
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
                  to add answers
                </i>
              </div>
            )}
            {user && (
              <div className="form-container">
                <div className="comment-box submit-box">
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="form-input textarea-new-comment"
                      value={answer}
                      placeholder="Your answer..."
                      onChange={answerHandler}
                    />

                    <Button
                      primary
                      className="btn-add-prompt"
                      type="submit"
                      label="Add answer"
                    />
                    {validForm && (
                      <Modal
                        title="Your answer has been submitted!"
                        open={openConfirmationModal}
                        toggle={() => setOpenConfirmationModal(false)}
                      />
                    )}
                    {invalidForm && (
                      <p className="error-message">{answerError}</p>
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
                  <Link to={`../gameplay/games/${question.gameSlug}`}>
                    <Button
                      secondary
                      label={question.gameTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="container-tags">
              <div className="badges">
                <p>Chapter: </p>
                <div>
                  <Link to={`../gameplay/chapters/${question.chapterId}`}>
                    <Button
                      secondary
                      label={question.chapterTitle?.toLowerCase()}
                      size="small"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {/* {topicsFromQuestions.length > 0 && (
              <div className="container-tags">
                <div className="badges">
                  <p className="p-no-margin">Related topics: </p>
                  <div className="badges-keywords">
                    {topicsFromQuestions.map((topic, index) => (
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
                      <Link to={`../questions/tags/${tag.slug}`}>
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
                <Link to={`/questions/search/${search.id}`} target="_blank">
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
                  `https://www.miniappshub.com/questions/${question.slug}`,
                )
              }
            />
            <FacebookShareButton url={`/questions/${question.slug}`}>
              <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://www.miniappshub.com/questions/${question.slug}`}
              title={`Check out this question: '${question.title}'`}
              hashtags={['Questions']}
            >
              <FontAwesomeIcon className="share-icon" icon={faTwitter} />
            </TwitterShareButton>
            <LinkedinShareButton
              url={`https://www.miniappshub.com/questions/${question.slug}`}
            >
              <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
            </LinkedinShareButton>
            <EmailShareButton
              subject="Check out this question!"
              body={`This question is great: '${question.title}'`}
              url={`https://www.miniappshub.com/questions/${question.slug}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </EmailShareButton>
            <Toast open={openToast} overlayClass={`toast ${animation}`}>
              <span>Copied to clipboard!</span>
            </Toast>
          </div>
          {/* <ContainerCta user={user} /> */}
          {/* {similarDealsFromQuestion.length > 0 && (
            <div className="container-alternatives">
              <h2>🔎 Other deals from {question.questionTitle} question</h2>
              <div className="container-cards small-cards">
                {cardItemsSimilarDealsFromQuestion}
              </div>
            </div>
          )} */}
          {similarQuestions.length > 0 && (
            <div className="container-alternatives">
              <h2>
                🔎 Other questions in {question.chapterTitle},{' '}
                {question.gameTitle}
              </h2>
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
