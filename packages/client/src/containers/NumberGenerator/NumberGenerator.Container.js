import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './NumberGenerator.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';

import useInputValidation from '../../utils/hooks/useInputValidation';
import TextFormInput from '../../components/Input/TextFormInput.component';

import { useUserContext } from '../../userContext';

export const NumberGenerator = () => {
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [numberRandom, setNumberRandom] = useState(false);
  const [numberMin, numberMinError, validateNumberMin] =
    useInputValidation('number');
  const [numberMax, numberMaxError, validateNumberMax] =
    useInputValidation('number');

  const generateRandomNumber = (min, max) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    const finalValue = Math.floor(
      Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
    );
    setNumberRandom(finalValue);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (numberMinError || numberMaxError) {
      setInvalidForm(true);
      setValidForm(false);
    } else {
      generateRandomNumber(numberMin, numberMax);
      setInvalidForm(false);
      setValidForm(true);
    }
  };

  return (
    <main>
      <Helmet>
        <title>Number Generator</title>
        <meta name="description" content="Random number generator" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Number generator</h1>
        <p className="subheading">Generate random number from 1 to 100</p>
      </div>
      <section className="container-tool">
        {numberRandom && <div className="form-result">{numberRandom}</div>}
        <div className="form-box submit-box">
          <form>
            <TextFormInput
              value={numberMin}
              placeholder="Number 1"
              onChange={validateNumberMin}
              error={numberMinError}
            />
            <TextFormInput
              value={numberMax}
              placeholder="Number 2"
              onChange={validateNumberMax}
              error={numberMaxError}
            />

            <Button
              primary
              className="btn-add-prompt"
              onClick={handleSubmit}
              label="Go"
            />

            {invalidForm && <p className="error-message">Form is not valid</p>}
          </form>
        </div>
      </section>
    </main>
  );
};
