/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './StarRating.styles.css';
import { FaStar } from 'react-icons/fa';

export const StarRating = ({ numberOfStars = 5 }) => {
  const [hover, setHover] = useState();
  const [rating, setRating] = useState();

  return (
    <div className="star-rating">
      {[...Array(parseInt(numberOfStars, 10))].map((_, index) => {
        const i = index + 1;
        return (
          <FaStar
            className={i <= hover || i <= rating ? 'active' : 'inactive'}
            onClick={() => setRating(i)}
            onMouseMove={() => setHover(i)}
            onMouseLeave={() => setHover(rating)}
            size="40"
          />
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  numberOfStars: PropTypes.number,
};

StarRating.defaultProps = {
  numberOfStars: null,
};
