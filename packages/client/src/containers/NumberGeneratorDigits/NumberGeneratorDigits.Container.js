import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './NumberGeneratorDigits.Style.css';
import { Button } from '../../components/Button/Button.component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import TextFormInput from '../../components/Input/TextFormInput.component';
import Toast from '../../components/Toast/Toast.Component';

import { useUserContext } from '../../userContext';

export const NumberGeneratorDigits = () => {
  const { numberOfNumbersParam, numberOfDigitsParam } = useParams();
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [numbersRandom, setNumbersRandom] = useState([]);
  const [numberOfNumbers, setNumberOfNumbers] = useState('');
  const [numberOfDigits, setNumberOfDigits] = useState('');
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');

  const keywords = numberOfDigitsParam
    ? [
        `random ${numberOfDigitsParam} digit number generator`,
        `random number generator ${numberOfDigitsParam} numbers`,
        `random number generator ${numberOfDigitsParam} digits`,
      ]
    : [
        'random number generator',
        'random digit number generator',
        'random number generator digits',
      ];

  useEffect(() => {
    if (numberOfNumbersParam && numberOfDigitsParam) {
      generateRandomNumbers(numberOfNumbersParam, numberOfDigitsParam);
    }
  }, [numberOfNumbersParam, numberOfDigitsParam]);

  const generateRandomNumbers = (numberOfNumbersP, numberOfDigitsP) => {
    const numbers = [];
    const min = 10 ** (numberOfDigitsP - 1);
    const max = 10 ** numberOfDigitsP - 1;

    for (let i = 0; i < numberOfNumbersP; i += 1) {
      numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    setNumbersRandom(numbers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!numberOfNumbers || !numberOfDigits) {
      setInvalidForm(true);
      setValidForm(false);
    } else {
      generateRandomNumbers(numberOfNumbers, numberOfDigits);
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
          {numberOfDigitsParam
            ? `Random ${numberOfDigitsParam} digit number generator`
            : 'Random digit number generator'}
        </title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">
          {numberOfDigitsParam
            ? `Random ${numberOfDigitsParam} digit number generator`
            : 'Random digit number generator'}
        </h1>
      </div>
      <section className="container-tool">
        {numbersRandom && (
          <div className="form-result">
            {numbersRandom.join(' ')}
            <div className="form-result-options">
              <button
                type="button"
                className="button-copy"
                onClick={() => copyToClipboard(numbersRandom.join(' '))}
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
                placeholder={numberOfNumbersParam || '2'}
                onChange={setNumberOfNumbers}
                label="random"
              />
              <TextFormInput
                type="number"
                value={numberOfDigits}
                placeholder={numberOfDigitsParam || '6'}
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
