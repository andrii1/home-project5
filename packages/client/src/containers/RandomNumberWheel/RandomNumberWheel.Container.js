import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './RandomNumberWheel.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import { Wheel } from '../../components/Wheel/Wheel.component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import useInputValidation from '../../utils/hooks/useInputValidation';
import TextFormInput from '../../components/Input/TextFormInput.component';
import Toast from '../../components/Toast/Toast.Component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';
import { useUserContext } from '../../userContext';

export const RandomNumberWheel = () => {
  const { numberMinParam, numberMaxParam } = useParams();
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [numberRandom, setNumberRandom] = useState();
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

  const [names, setNames] = useState(['one', 'two']);

  // useEffect(() => {
  //   if (numberMinParam && numberMaxParam) {
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
    const list = [];
    for (let i = minCeiled; i <= maxFloored; i += 1) {
      list.push(i);
    }
    const listArrayOfObjects = list.map((item) => {
      return {
        option: `${item}`,
      };
    });

    const newPrizeNumber = Math.floor(
      Math.random() * listArrayOfObjects.length,
    );

    // const newPrizeNumber = Math.floor(
    //   Math.random() * listArrayOfObjects.length,
    // );
    // setPrizeNumber(newPrizeNumber);
    // setSpinnerData(listArrayOfObjects);
    // setMustSpin(true);
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    if (numberMinError || numberMaxError) {
      setInvalidForm(true);
      setValidForm(false);
    } else {
      generateRandomNumber(numberMin, numberMax);
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
            : 'Random number wheel'}
        </title>
        <meta name="description" content="Random number wheel" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">
          {numberMinParam && numberMaxParam
            ? `${numberMinParam} - ${numberMaxParam} generator`
            : 'Random number wheel'}
        </h1>
        <p className="subheading">
          {numberMinParam && numberMaxParam
            ? `Generate a random number from ${numberMinParam} to ${numberMaxParam}`
            : 'Generate a random number'}
        </p>
      </div>
      <section className="container-tool">
        <Wheel participants={names} />

        {numberRandom !== undefined && (
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
          <form>
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
              primary
              className="btn-add-prompt"
              onClick={() => generateRandomNumber(numberMin, numberMax)}
              label="Spin"
            />

            {invalidForm && <p className="error-message">Form is not valid</p>}
          </form>
        </div>
      </section>
    </main>
  );
};