import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './NumberGenerator.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import useInputValidation from '../../utils/hooks/useInputValidation';
import TextFormInput from '../../components/Input/TextFormInput.component';
import Toast from '../../components/Toast/Toast.Component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

import { useUserContext } from '../../userContext';

export const NumberGenerator = () => {
  const { numberMinParam, numberMaxParam } = useParams();
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [numberRandom, setNumberRandom] = useState(false);
  const [numberMin, numberMinError, validateNumberMin] =
    useInputValidation('number');
  const [numberMax, numberMaxError, validateNumberMax] =
    useInputValidation('number');
  const [openToast, setOpenToast] = useState(false);
  const [animation, setAnimation] = useState('');
  const [selectedOptionOddEven, setSelectedOptionOddEven] =
    useState('Odd/Even');
  const [selectedOptionInclusive, setSelectedOptionInclusive] =
    useState('Inclusive');

  useEffect(() => {
    if (numberMinParam && numberMaxParam) {
      generateRandomNumber(
        numberMinParam,
        numberMaxParam,
        'Odd/Even',
        'Inclusive',
      );
    }
  }, [numberMinParam, numberMaxParam]);

  const generateRandomNumber = (min, max, optionOdd, optionInclusive) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    let finalValue;

    if (optionInclusive === 'Inclusive') {
      finalValue = Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
      );
    } else if (optionInclusive === 'Exclusive') {
      finalValue = Math.floor(
        Math.random() * (maxFloored - minCeiled) + minCeiled,
      );
    }

    if (optionOdd === 'Odd') {
      if (finalValue % 2 === 0) {
        // generated number is even
        if (finalValue === max) {
          finalValue -= 1;
        } else {
          finalValue += 1;
        }
      }
    } else if (optionOdd === 'Even') {
      if (finalValue % 2 !== 0) {
        // generated number is odd
        if (finalValue === max) {
          finalValue -= 1;
        } else {
          finalValue += 1;
        }
      }
    }
    setNumberRandom(finalValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (numberMinError || numberMaxError) {
      setInvalidForm(true);
      setValidForm(false);
    } else {
      generateRandomNumber(
        numberMin,
        numberMax,
        selectedOptionOddEven,
        selectedOptionInclusive,
      );
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

  const optionsOddEven = ['Odd/even', 'Odd', 'Even'];
  const optionsInclusive = ['Inclusive', 'Exclusive'];

  return (
    <main>
      <Helmet>
        <title>
          {numberMinParam && numberMaxParam
            ? `${numberMinParam} - ${numberMaxParam} generator`
            : 'Number generator'}
        </title>
        <meta name="description" content="Random number generator" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">
          {numberMinParam && numberMaxParam
            ? `${numberMinParam} - ${numberMaxParam} generator`
            : 'Number generator'}
        </h1>
        <p className="subheading">
          {numberMinParam && numberMaxParam
            ? `Generate a random number from ${numberMinParam} to ${numberMaxParam}`
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
            <div className="container-form-dropdown">
              <Dropdown
                options={optionsOddEven}
                onSelect={(option) => setSelectedOptionOddEven(option)}
                showFilterIcon={false}
                showLabel={false}
              />
              <Dropdown
                options={optionsInclusive}
                onSelect={(option) => setSelectedOptionInclusive(option)}
                showFilterIcon={false}
                showLabel={false}
              />
            </div>
            <TextFormInput
              value={numberMin}
              placeholder={numberMinParam || 'Number min'}
              onChange={validateNumberMin}
              error={numberMinError}
            />
            <TextFormInput
              value={numberMax}
              placeholder={numberMaxParam || 'Number max'}
              onChange={validateNumberMax}
              error={numberMaxError}
            />
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
