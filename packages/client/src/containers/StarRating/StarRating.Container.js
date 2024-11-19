/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Helmet } from 'react-helmet';
import { StarRating } from '../../components/StarRating/StarRating.component';
import './StarRating.Style.css';

export const StarRatingContainer = () => {
  return (
    <main>
      <Helmet>
        <title>Star Rating React</title>
        <meta name="description" content="Star rating React" />
      </Helmet>
      <div className="hero">
        <h1 className="hero-header">Star rating React</h1>
      </div>
      <div className="star-rating-container">
        <StarRating numberOfStars={5} />
      </div>
    </main>
  );
};
