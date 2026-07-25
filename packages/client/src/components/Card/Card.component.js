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
import appImage from '../../assets/images/app-placeholder.svg';
// import appImage from '../../../public/assets/images/small-screenshot.png';
import { useUserContext } from '../../userContext';

import './Card.styles.css';

export const Card = ({
  title,
  description,
  topic,
  topicId,
  pricingType,
  url,
  urlImage,
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
        className="card-category--small card-image--small"
        style={{
          backgroundImage: `url(http://res.cloudinary.com/dgarvanzw/image/upload/w_500,q_auto,f_auto/apps_ai/${urlImage}.png )`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="card-header">
          <Link to={`/games/${id}`} target="_blank">
            <h2>{title}</h2>
          </Link>
        </div>
      </Link>
    );
  }

  return (
    <div className={listCard ? 'card-list' : 'card-category'}>
      <Link
        to={`/games/${id}`}
        target="_blank"
        className={`card-image ${listCard ? 'list' : ''}`}
        style={{
          backgroundImage: `url(http://res.cloudinary.com/dgarvanzw/image/upload/w_${
            listCard ? '500' : '700'
          },q_auto,f_auto/apps_ai/${urlImage}.png )`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div className={`card-body ${listCard ? 'list' : ''}`}>
        <div className="card-header">
          <div className="card-title">
            <Link to={`/games/${id}`} target="_blank">
              <h2>{title}</h2>
            </Link>
            <Link to={`/games/${id}`} target="_blank">
              <FontAwesomeIcon
                className="icon-card"
                icon={faArrowUpRightFromSquare}
                style={{ color: '#e5989b' }}
                size="lg"
              />
            </Link>
          </div>
        </div>
        {description && (
          <div className="card-description">
            {`${description.split(' ').slice(0, 15).join(' ')}...`}
          </div>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  topic: PropTypes.string,
  topicId: PropTypes.string,
  pricingType: PropTypes.string,
  id: PropTypes.string,
  url: PropTypes.shape,
  urlImage: PropTypes.string,
  smallCard: PropTypes.bool,
  listCard: PropTypes.bool,
  className: PropTypes.string,
  isFavorite: PropTypes.func,
  addFavorite: PropTypes.func,
  deleteBookmark: PropTypes.func,
  bookmarkOnClick: PropTypes.func,
};

Card.defaultProps = {
  title: null,
  description: null,
  pricingType: null,
  topicId: null,
  topic: null,
  url: null,
  urlImage: null,
  id: null,
  smallCard: false,
  listCard: false,
  className: null,
  isFavorite: undefined,
  addFavorite: undefined,
  deleteBookmark: undefined,
  bookmarkOnClick: undefined,
};
