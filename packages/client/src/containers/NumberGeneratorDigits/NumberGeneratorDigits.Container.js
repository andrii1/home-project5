import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './NumberGeneratorDigits.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import useInputValidation from '../../utils/hooks/useInputValidation';
import TextFormInput from '../../components/Input/TextFormInput.component';
import Toast from '../../components/Toast/Toast.Component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

import { useUserContext } from '../../userContext';

export const NumberGeneratorDigits = () => {
  const { numberOfNumbersParam, numberOfDigitsParam } = useParams();
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [numberRandom, setNumberRandom] = useState(false);
  const [numberMin, numberMinError, validateNumberMin] =
    useInputValidation('number');
  const [numberMax, numberMaxError, validateNumberMax] =
    useInputValidation('number');
  const [numberOfNumbers, setNumberOfNumbers] = useState('');
  const [numberOfDigits, setNumberOfDigits] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');
  const [selectedOptionOddEven, setSelectedOptionOddEven] =
    useState('Odd/Even');
  const [selectedOptionInclusive, setSelectedOptionInclusive] =
    useState('Inclusive');

  // useEffect(() => {
  //   if (numberOfNumbersParam && numberMaxParam) {
  //     generateRandomNumber(
  //       numberMinParam,
  //       numberMaxParam,
  //       'Odd/Even',
  //       'Inclusive',
  //     );
  //   }
  // }, [numberMinParam, numberMaxParam]);

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
    if (!numberOfNumbers || !numberOfDigits) {
      setInvalidForm(true);
      setValidForm(false);
    } else {
      generateRandomNumber(numberOfNumbers, numberOfDigits);
      setInvalidForm(false);
      setValidForm(true);
    }
  };

  const copyToClipboard = (item) => {
    navigator.clipboard.writeText(item);
    setOpenToast(true);
    setAnimation('open-animation');

    setTimeout(() => {
      setAnimation('close-animation');
    }, 2000);
    setTimeout(() => {
      setOpenToast(false);
    }, 2500);
  };

  return (
    <main className="random-digit-number-generator">
      <Helmet>
        <title>
          {numberOfNumbersParam && numberOfDigitsParam
            ? `${numberOfNumbersParam} - ${numberOfDigitsParam} generator`
            : 'Number generator'}
        </title>
        <meta name="description" content="Random number generator" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">
          {numberOfNumbersParam && numberOfDigitsParam
            ? `${numberOfNumbers} - ${numberOfDigitsParam} generator`
            : 'Number generator'}
        </h1>
        <p className="subheading">
          {numberOfNumbers && numberOfDigitsParam
            ? `Generate a random number from ${numberOfNumbers} to ${numberOfDigitsParam}`
            : 'Generate a random number'}
        </p>
      </div>
      <section className="container-tool">
        {numberRandom && (
          <div className="form-result">
            {numberRandom}
            <div className="form-result-options">
              <button
                type="button"
                className="button-copy"
                onClick={() => copyToClipboard(numberRandom)}
              >
                <img src={iconCopy} alt="copy" className="icon-copy" />
              </button>
              <Toast open={openToast} overlayClass={`toast ${animation}`}>
                <span>Copied to clipboard!</span>
              </Toast>
            </div>
          </div>
        )}
        <div className="form-box submit-box">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <TextFormInput
                type="number"
                value={numberOfNumbers}
                placeholder={numberOfNumbersParam || 'Number min'}
                onChange={setNumberOfNumbers}
                label="random"
              />
              <TextFormInput
                type="number"
                value={numberOfDigits}
                placeholder={numberOfDigitsParam || 'Number max'}
                onChange={setNumberOfDigits}
                label="digit numbers"
              />
            </div>
            <Button
              type="submit"
              primary
              className="btn-add-prompt"
              label="Go"
            />
            {invalidForm && <p className="error-message">Form is not valid</p>}
          </form>
        </div>
      </section>
    </main>
  );
};
