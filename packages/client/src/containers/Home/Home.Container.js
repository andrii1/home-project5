import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Home.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TOOLS } from '../../data.js';

export const Home = () => {
  const cardItems = TOOLS.map((tool) => {
    return (
      <Link to={tool.url}>
        <Button label={tool.title} secondary />
      </Link>
    );
  });
  return (
    <main>
      <Helmet>
        <title>Tools - discover best tools</title>
        <meta
          name="description"
          content="Find best Chat GPT prompts for free"
        />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Tools</h1>
        <p className="subheading">Discover great tools</p>
      </div>
      <section className="container-tools">{cardItems}</section>
    </main>
  );
};
