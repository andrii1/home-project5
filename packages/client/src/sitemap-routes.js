import React from 'react';
import { Route } from 'react-router-dom';

export default (
  <Route>
    {/* <Route path="/" /> */}
    {/* <Route path="/apps" /> */}
    <Route path="/numbergenerator" />
    <Route exact path="/numbergenerator/:numberMinParam/:numberMaxParam" />
    <Route path="/random-number-wheel" />
    <Route exact path="/random-number-wheel/:numberMinParam/:numberMaxParam" />
    <Route path="/list-randomizer-wheel" />
    <Route path="/random-color-generator-react" />
    <Route path="/random-qr-code" />
    <Route path="/star-rating" />
    <Route path="/github-profile-search" />
    <Route path="/weather-app" />
    <Route path="/weather-app/:cityParam" />
    <Route path="/eye-gymnastics" />
    {/* <Route exact path="/apps/:id" />
    <Route exact path="/apps/topic/:topicIdParam" />
    <Route exact path="/apps/category/:categoryIdParam" /> */}
    {/* <Route exact path="/faq" /> */}
    <Route exact path="/login" />
    <Route exact path="/signup" />
  </Route>
);
