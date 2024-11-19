import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Home.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Home = () => {
  const tools = [
    { id: 1, title: 'Number Generator', url: 'numbergenerator' },
    { id: 2, title: 'Random number wheel', url: 'random-number-wheel' },
    { id: 3, title: 'List randomizer wheel', url: 'list-randomizer-wheel' },
    {
      id: 4,
      title: 'Random color generator React',
      url: 'random-color-generator-react',
    },
  ];
  const cardItems = tools.map((tool) => {
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
