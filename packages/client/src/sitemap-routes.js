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
    {/* <Route exact path="/apps/:id" />
    <Route exact path="/apps/topic/:topicIdParam" />
    <Route exact path="/apps/category/:categoryIdParam" /> */}
    {/* <Route exact path="/faq" /> */}
    <Route exact path="/login" />
    <Route exact path="/signup" />
  </Route>
);
