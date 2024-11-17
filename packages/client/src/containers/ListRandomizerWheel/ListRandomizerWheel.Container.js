/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './ListRandomizerWheel.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import { Wheel } from '../../components/Wheel/Wheel.component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import useInputValidation from '../../utils/hooks/useInputValidation';
import TextFormInput from '../../components/Input/TextFormInput.component';
import Toast from '../../components/Toast/Toast.Component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';
import { useUserContext } from '../../userContext';
// eslint-disable-next-line import/no-extraneous-dependencies
import confetti from 'canvas-confetti';
import Modal from '../../components/Modal/Modal.Component';
import { capitalize } from '../../utils/capitalize';
import { MAX_ITEMS_WHEEL } from '../../constants';
import { Items } from '../../components/Items/Items.component';

export const ListRandomizerWheel = () => {
  const { numberMinParam, numberMaxParam } = useParams();
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [spinDirection, setSpinDirection] = useState('clockwise');
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

  const [items, setItems] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupWinner, setPopupWinner] = useState(null);
  const numSectors = items.length;

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
    let list = [];
    for (let i = minCeiled; i <= maxFloored; i += 1) {
      list.push(i);
    }

    if (optionInclusive === 'Exclusive') {
      list.pop();
    }

    if (optionOdd === 'Odd') {
      list = list.filter((n) => n % 2 !== 0);
    } else if (optionOdd === 'Even') {
      list = list.filter((n) => n % 2 === 0);
    }

    setItems(list);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      numberMinError ||
      numberMaxError ||
      numberMin === '' ||
      numberMax === ''
    ) {
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
  const changeSpinDirection = () => {
    setSpinDirection(
      spinDirection === 'clockwise' ? 'counterclockwise' : 'clockwise',
    );
  };

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);

    // Set the number of full rotations and calculate final rotation
    const numFullRotations = Math.random() * 5 + 5; // Between 5 and 10 full rotations
    const totalRotation = numFullRotations * 360;
    const finalRotation =
      (rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation)) %
      360;

    const spinDuration = 6000;
    const easing = (t) => {
      // Ease-out cubic
      // eslint-disable-next-line prefer-exponentiation-operator
      return 1 - Math.pow(1 - t, 3);
    };

    let startTime;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(elapsed / spinDuration, 1);
      const easeT = easing(t);
      const currentRotation =
        rotation +
        (spinDirection === 'clockwise' ? -totalRotation : totalRotation) *
          easeT;

      setRotation(currentRotation);

      if (elapsed < spinDuration) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        determineWinner(finalRotation);
      }
    };

    requestAnimationFrame(animate);
  };

  const determineWinner = (finalRotation) => {
    const sliceAngle = 360 / numSectors;
    const normalizedRotation = ((finalRotation % 360) + 360) % 360;
    const winningSector = Math.floor(normalizedRotation / sliceAngle);

    setPopupWinner(items[winningSector]);
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup) {
      startConfetti();
      const timer = setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const toggleModal = () => {
    setShowPopup(false);
    document.body.style.overflow = 'visible';
  };

  const handleAddItem = (listItem) => {
    if (items.length < MAX_ITEMS_WHEEL) {
      setItems([...items, listItem]);
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <main>
      <Helmet>
        <title>
          {numberMinParam && numberMaxParam
            ? `${numberMinParam} - ${numberMaxParam} wheel generator`
            : 'List randomizer wheel'}
        </title>
        <meta name="description" content="List randomizer wheel" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">
          {numberMinParam && numberMaxParam
            ? `${numberMinParam} - ${numberMaxParam} wheel generator`
            : 'List randomizer wheel'}
        </h1>
        <p className="subheading">
          {numberMinParam && numberMaxParam
            ? `Generate a random number from ${numberMinParam} to ${numberMaxParam}`
            : 'Choose a random item from list'}
        </p>
      </div>
      <section className="container-tool">
        <Wheel
          participants={items}
          rotation={rotation}
          numSectors={numSectors}
        />
        <div className="form-box submit-box">
          <Items
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            // shuffleNames={shuffleNames}
            // sortNames={sortNames}
            items={items}
          />
          {/* <form>
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
            <div className="container-form-inputs">
              <TextFormInput
                label="From"
                value={numberMin}
                placeholder={numberMinParam || 'Number min'}
                onChange={validateNumberMin}
                error={numberMinError}
                classNameWrapper="row-input"
              />
              <TextFormInput
                label="To"
                value={numberMax}
                placeholder={numberMaxParam || 'Number max'}
                onChange={validateNumberMax}
                error={numberMaxError}
                classNameWrapper="row-input"
              />
            </div>
            <div className="container-buttons-form">
              {items.length !== 0 && (
                <Button
                  secondary
                  onClick={changeSpinDirection}
                  disabled={items.length === 0 || spinning}
                >
                  {capitalize(spinDirection)}
                </Button>
              )}
              {items.length === 0 ? (
                <Button
                  primary
                  type="submit"
                  onClick={handleSubmit}
                  label="Start"
                />
              ) : items.length !== 0 ? (
                <Button
                  primary
                  onClick={startSpin}
                  disabled={items.length === 0 || spinning}
                >
                  Spin
                </Button>
              ) : (
                ''
              )}
            </div>

            {invalidForm && <p className="error-message">Form is not valid</p>}
          </form> */}
          {items.length > 1 ? (
            <div>
              <Button
                primary
                onClick={startSpin}
                disabled={items.length === 0 || spinning}
              >
                Spin
              </Button>
            </div>
          ) : (
            'Add at least two items to start a spin'
          )}
        </div>
        <div className="container-sources">
          Sources:
          <ul>
            <li>
              <Link
                className="simple-link"
                target="_blank"
                to="https://github.com/mihailgaberov/Wheel-of-Names/tree/main"
              >
                Wheel of names
              </Link>
            </li>
          </ul>
        </div>
        <Modal open={showPopup} toggle={toggleModal}>
          <h2>Congratulations!</h2>
          <h3>{popupWinner}</h3>
        </Modal>
      </section>
    </main>
  );
};
