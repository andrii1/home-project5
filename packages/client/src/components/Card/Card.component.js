/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button.component';
import { Badge } from '../Badge/Badge.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
// import appImage from '../../../public/assets/images/small-screenshot.png';
import { useUserContext } from '../../userContext';

import './Card.styles.css';

export const Card = ({
  title,
  summary,
  referralCode,
  referralCodeOnClick,
  topic,
  topicId,
  appId,
  appTitle,
  url,
  cardUrl,
  urlImage,
  urlImageIcon,
  id,
  className,
  smallCard = true,
  listCard = false,
  isFavorite,
  addFavorite,
  deleteBookmark,
  bookmarkOnClick,
}) => {
  const { user } = useUserContext();
  if (smallCard) {
    return (
      <Link
        to={cardUrl}
        className="card-category--small card-image--small"
        style={{
          backgroundImage: `url(http://res.cloudinary.com/dgarvanzw/image/upload/w_500,q_auto,f_auto/deals/${urlImage}.${
            urlImage === 'deal' ? 'svg' : 'png'
          } )`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="card-header">
          <Link to={cardUrl} target="_blank">
            <h2>{title}</h2>
          </Link>
        </div>
        <div className="topics-bookmark--small">
          <Badge
            className="storybook-badge--transparent"
            label={topic}
            size="small"
          />
          {appTitle && <Badge primary label={appTitle} size="small" />}
        </div>
      </Link>
    );
  }

  return (
    <Link to={cardUrl} className={listCard ? 'card-list' : 'card-category'}>
      <div className={`card-image ${listCard ? 'list' : ''}`}>
        <img
          className={`${listCard ? 'img-app-icon-list' : 'img-app-icon'} ${
            urlImageIcon ? 'icon-shadow' : ''
          }`}
          alt="test"
          src={urlImage}
        />
      </div>

      <div className={`card-body ${listCard ? 'list' : ''}`}>
        <div className="card-header">
          <div className="card-title">
            <h2>{title}</h2>
          </div>
          {/* <Badge label={appTitle} size="small" /> */}
        </div>
        {summary && <div className="card-description">{summary}</div>}
      </div>
    </Link>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  summary: PropTypes.string,
  referralCode: PropTypes.string,
  referralCodeOnClick: PropTypes.func,
  topic: PropTypes.string,
  topicId: PropTypes.string,
  appTitle: PropTypes.string,
  appId: PropTypes.string,
  id: PropTypes.string,
  url: PropTypes.shape,
  cardUrl: PropTypes.shape,
  urlImage: PropTypes.string,
  smallCard: PropTypes.bool,
  listCard: PropTypes.bool,
  urlImageIcon: PropTypes.bool,
  className: PropTypes.string,
  isFavorite: PropTypes.func,
  addFavorite: PropTypes.func,
  deleteBookmark: PropTypes.func,
  bookmarkOnClick: PropTypes.func,
};

Card.defaultProps = {
  title: null,
  summary: null,
  referralCode: null,
  appTitle: null,
  appId: null,
  topicId: null,
  topic: null,
  url: null,
  cardUrl: null,
  urlImage: null,
  id: null,
  smallCard: false,
  listCard: false,
  urlImageIcon: false,
  className: null,
  isFavorite: undefined,
  addFavorite: undefined,
  deleteBookmark: undefined,
  bookmarkOnClick: undefined,
  referralCodeOnClick: undefined,
};
