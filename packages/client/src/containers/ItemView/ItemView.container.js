/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import { Loading } from '../../components/Loading/Loading.Component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import {
  faEnvelope,
  faLink,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';

import './ItemView.styles.css';

export const ItemView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSingleItem = async (param) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://forkify-api.herokuapp.com/api/get?rId=${param}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch');
        }
        setItem(data.recipe);
        setError(null);

        // setSearch('');
      } catch (e) {
        setError({ message: e.message || 'An error occured' });
      }
      setLoading(false);
    };

    fetchSingleItem(id);
  }, [id]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading...</title>
          <meta name="description" content="Fetching recipe details" />
        </Helmet>
        <main className="loading-container">
          <Loading />
        </main>
      </>
    );
  }

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
        <title>{item?.title?.substring(0, 50) || 'Loading...'}</title>
        <meta name="description" content={item?.title} />
      </Helmet>
      <main>
        <section className="container-appview">
          <h1 className="hero-header">{item?.title || 'Loading...'}</h1>
          <img
            className="appview-image"
            alt={item.title}
            src={item.image_url}
          />

          <div className="container-description">
            <div className="container-title">
              <h3>{item.title}</h3>
            </div>
            <p>{item.ingredients}</p>
          </div>

          <div className="icons-apps-page">
            <span>Share it: </span>
            <button
              type="button"
              className="button-copy"
              onClick={() => {
                navigator.clipboard.writeText(item.title, item.ingredients);
              }}
            >
              <img src={iconCopy} alt="copy" className="icon-copy" />
            </button>
            <FontAwesomeIcon
              icon={faLink}
              className="button-copy"
              onClick={() => {
                navigator.clipboard.writeText(`/recipes/${id}`);
              }}
            />
            <FacebookShareButton url={`/recipes/${id}`}>
              <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
            </FacebookShareButton>
            <TwitterShareButton
              url={`/recipes/${id}`}
              title={`Check out this: '${item.title}'`}
              hashtags={['Apps']}
            >
              <FontAwesomeIcon className="share-icon" icon={faTwitter} />
            </TwitterShareButton>
            <LinkedinShareButton url={`/recipes/${id}`}>
              <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
            </LinkedinShareButton>
            <EmailShareButton
              subject="Check this out!"
              body={`This is great: '${item.title}'`}
              url={`/recipes/${id}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </EmailShareButton>
          </div>
        </section>
        <Link to="/recipes">
          <Button label="Back" />
        </Link>
      </main>
    </>
  );
};
