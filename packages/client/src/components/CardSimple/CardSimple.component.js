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

import './CardSimple.styles.css';

export const CardSimple = ({
  title,
  description,
  topic,
  topicId,
  label,
  url,
  urlImage,
  urlLabel,
  id,
  className,
  smallCard = true,
  listCard = false,
  isFavorite,
  addFavorite,
  deleteBookmark,
  bookmarkOnClick,
}) => {
  return (
    <div className={`${listCard ? 'card-list' : 'card-category'} card-simple`}>
      <Link
        to={`/recipes/${id}`}
        target="_blank"
        className={`card-image ${listCard ? 'list' : ''}`}
        style={{
          backgroundImage: `url(${urlImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div className={`card-body ${listCard ? 'list' : ''}`}>
        <div className="card-header">
          <div className="card-title">
            <Link to={`/recipes/${id}`} target="_blank">
              <h2>{title}</h2>
            </Link>
            <Link to={`/recipes/${id}`} target="_blank">
              <FontAwesomeIcon
                className="icon-card"
                icon={faArrowUpRightFromSquare}
                style={{ color: '#e5989b' }}
                size="lg"
              />
            </Link>
          </div>
        </div>
        <div className="card-description">
          {description && description.split(' ').slice(0, 15).join(' ')}
        </div>
        {label && (
          <div className="topics-bookmark">
            <Link to={urlLabel} target="_blank">
              <Button
                label={label}
                size="small"
                icon={
                  <FontAwesomeIcon
                    className="icon-card"
                    icon={faArrowUpRightFromSquare}
                    style={{ color: '#fff' }}
                    size="sm"
                  />
                }
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

CardSimple.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  topic: PropTypes.string,
  topicId: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  url: PropTypes.shape,
  urlImage: PropTypes.string,
  urlLabel: PropTypes.string,
  smallCard: PropTypes.bool,
  listCard: PropTypes.bool,
  className: PropTypes.string,
  isFavorite: PropTypes.func,
  addFavorite: PropTypes.func,
  deleteBookmark: PropTypes.func,
  bookmarkOnClick: PropTypes.func,
};

CardSimple.defaultProps = {
  title: null,
  description: null,
  label: null,
  topicId: null,
  topic: null,
  url: null,
  urlImage: null,
  urlLabel: null,
  id: null,
  smallCard: false,
  listCard: false,
  className: null,
  isFavorite: undefined,
  addFavorite: undefined,
  deleteBookmark: undefined,
  bookmarkOnClick: undefined,
};
