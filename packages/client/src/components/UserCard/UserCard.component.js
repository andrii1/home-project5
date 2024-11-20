/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './UserCard.styles.css';

export const UserCard = ({ user }) => {
  const {
    avatar_url,
    login,
    followers,
    following,
    public_repos,
    url,
    created_at,
    name,
    email,
  } = user;
  const createdDate = new Date(created_at);

  return (
    <div className="github-profile-search-result-container">
      <img
        className="github-img"
        src={avatar_url}
        alt={`${login}'s GitHub profile`}
      />
      <div>
        <a
          className="simple-link"
          target="_blank"
          rel="noreferrer"
          href={`https://github.com/${login}`}
        >
          {name || login}
        </a>
      </div>
      <div>
        <p>
          <strong>GitHub Profile Link: </strong>
        </p>
        <a
          className="simple-link"
          target="_blank"
          rel="noreferrer"
          href={`https://github.com/${login}`}
        >
          {`https://github.com/${login}`}
        </a>
      </div>
      <div>
        <p>
          Joined on:{' '}
          {`${createdDate.getDate()}
          ${createdDate.toLocaleString('en-us', { month: 'short' })}
          ${createdDate.getFullYear()}`}
        </p>{' '}
      </div>
      {email && (
        <div>
          <p>Email: {email} </p>
        </div>
      )}
      <div>
        <p>Followers: {followers} </p>
      </div>
      <div>
        <p>Following: {following} </p>
      </div>
      <div>
        <p>Following: {following} </p>
      </div>
      <div>
        <p>Public repos: {public_repos} </p>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape,
};

UserCard.defaultProps = {
  user: null,
};
