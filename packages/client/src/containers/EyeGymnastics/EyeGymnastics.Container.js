/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';
import './EyeGymnastics.Style.css';

export const EyeGymnastics = () => {
  return (
    <main>
      <Helmet>
        <title>Eye gymnastics</title>
        <meta name="description" content="Eye gymnastics" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Eye gymnastics</h1>
        <p className="subheading">Follow the ball on the screen</p>
      </div>
      <section className="container-tool">1</section>
    </main>
  );
};
