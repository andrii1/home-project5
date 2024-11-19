import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Categories } from './containers/Categories/Categories.Container';
import { Home } from './containers/Home/Home.Container';
import { Apps } from './containers/Apps/Apps.Container';
import { LandingPage } from './containers/LandingPage/LandingPage.Container';
import TestPage from './containers/TestPage/TestPage.Container';
import { Prompts } from './containers/Prompts/Prompts.Container';
import { AppView } from './containers/AppView/AppView.container';
import { Signup } from './containers/Signup/Signup.Container';
import Login from './containers/Login/Login.Container';
import Reset from './containers/Reset/Reset.Container';
import { Dashboard } from './containers/Dashboard/Dashboard.Container';
import { Bookmarks } from './containers/Bookmarks/Bookmarks.Container';
import { Faq } from './containers/Faq/Faq.Container';
import { Submit } from './containers/Submit/Submit.Container';
import { StripeSuccess } from './containers/StripeSuccess/StripeSuccess.Container';
import { StripeCancel } from './containers/StripeCancel/StripeCancel.Container';
import { PageNotFound } from './containers/PageNotFound/PageNotFound.Container';
import { Navigation } from './components/Navigation/Navigation.component';
import { Footer } from './components/Footer/Footer.component';
import { UserProvider } from './userContext';
import { NumberGenerator } from './containers/NumberGenerator/NumberGenerator.Container';
import { RandomNumberWheel } from './containers/RandomNumberWheel/RandomNumberWheel.Container';
import { ListRandomizerWheel } from './containers/ListRandomizerWheel/ListRandomizerWheel.Container';
import { RandomColorGenerator } from './containers/RandomColorGenerator/RandomColorGenerator.Container';
import { RandomQrCode } from './containers/RandomQrCode/RandomQrCode.Container';
import { StarRatingContainer } from './containers/StarRating/StarRating.Container';

function App() {
  return (
    <div className="app">
      <Router>
        <UserProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/numbergenerator" element={<NumberGenerator />} />
            <Route
              path="/random-number-wheel"
              element={<RandomNumberWheel />}
            />
            <Route
              exact
              path="/numbergenerator/:numberMinParam/:numberMaxParam"
              element={<NumberGenerator />}
            />
            <Route
              exact
              path="/random-number-wheel/:numberMinParam/:numberMaxParam"
              element={<RandomNumberWheel />}
            />
            <Route
              path="/list-randomizer-wheel"
              element={<ListRandomizerWheel />}
            />
            <Route
              path="/random-color-generator-react"
              element={<RandomColorGenerator />}
            />
            <Route path="/random-qr-code" element={<RandomQrCode />} />
            <Route path="/star-rating" element={<StarRatingContainer />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/test" element={<Prompts />} />
            <Route path="/categories" element={<Categories />} />
            <Route exact path="/apps/:id" element={<AppView />} />
            <Route exact path="/apps/topic/:topicIdParam" element={<Apps />} />
            <Route
              exact
              path="/apps/category/:categoryIdParam"
              element={<Apps />}
            />
            <Route exact path="/faq" element={<Faq />} />
            <Route exact path="/apps/new" element={<Submit />} />
            <Route exact path="/success" element={<StripeSuccess />} />
            <Route exact path="/cancel" element={<StripeCancel />} />
            <Route exact path="/bookmarks" element={<Bookmarks />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/reset" element={<Reset />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Footer />
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
