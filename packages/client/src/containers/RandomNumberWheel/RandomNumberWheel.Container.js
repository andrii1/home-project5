import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './RandomNumberWheel.Style.css';
import { apiURL } from '../../apiURL';
import { Button } from '../../components/Button/Button.component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import useInputValidation from '../../utils/hooks/useInputValidation';
import TextFormInput from '../../components/Input/TextFormInput.component';
import Toast from '../../components/Toast/Toast.Component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';
import { useUserContext } from '../../userContext';
// eslint-disable-next-line import/no-extraneous-dependencies
import confetti from 'canvas-confetti';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Wheel } from 'react-custom-roulette';

const colors = [
  '#CC4629', // Darker vibrant orange
  '#CC9A29', // Darker bright yellow
  '#B2CC29', // Darker light green-yellow
  '#5ECC29', // Darker bright green
  '#29CC46', // Darker bright teal-green
  '#29CC99', // Darker turquoise
  '#2985CC', // Darker sky blue
  '#293FCC', // Darker bright blue
  '#4629CC', // Darker purple
  '#9929CC', // Darker violet
  '#CC2981', // Darker hot pink
  '#CC2929', // Darker red
  '#CC5929', // Darker coral
  '#CC9529', // Darker gold
  '#B2CC29', // Darker lime green
  '#66CC29', // Darker olive green
  '#29CC5F', // Darker mint green
  '#29CC91', // Darker pale turquoise
  '#298ECC', // Darker deep sky blue
  '#4A29CC', // Darker royal blue
  '#8429CC', // Darker medium purple
  '#CC298F', // Darker fuchsia
  '#CC294F', // Darker hot pink
];

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
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState();
  const [participants, setParticipants] = useState(['one', 'two']);

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinDirection, setSpinDirection] = useState('clockwise');

  const [showPopup, setShowPopup] = useState(false);
  const [popupWinner, setPopupWinner] = useState(null);

  const canvasRef = useRef(null);
  const numSectors = participants.length;

  useEffect(() => {
    if (canvasRef.current) {
      drawWheel();
    }
  }, [participants, rotation]);

  // const handleSpinClick = () => {
  //   if (!mustSpin) {
  //     const newPrizeNumber = Math.floor(Math.random() * data.length);
  //     setPrizeNumber(newPrizeNumber);
  //     setSpinnerData([{ option: '0' }, { option: '1' }, { option: '2' }]);
  //     setMustSpin(true);
  //   }
  // };

  const darkenColor = (color, amount) => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    // eslint-disable-next-line no-bitwise
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  function drawWheel() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / numSectors;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);
    ctx.rotate(-rotation * (Math.PI / 180));

    // Draw sectors
    for (let i = 0; i < numSectors; i += 1) {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      const color = darkenColor(colors[i % colors.length], 30);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw the name in the sector
      ctx.save();
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 3;
      ctx.fillText(participants[i] || '', radius * 0.5, 0);
      ctx.restore();
    }

    ctx.rotate(rotation * (Math.PI / 180)); // Reset rotation
    ctx.translate(-radius, -radius);

    // Draw the static indicator
    const indicatorLength = 20;
    const indicatorWidth = 10;
    ctx.save();
    ctx.translate(canvas.width, canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(-indicatorLength, -indicatorWidth / 2);
    ctx.lineTo(0, -indicatorWidth / 2);
    ctx.lineTo(0, indicatorWidth / 2);
    ctx.lineTo(-indicatorLength, indicatorWidth / 2);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
  }

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

    setPopupWinner(participants[winningSector]);
    setShowPopup(true);
  };

  const changeSpinDirection = () => {
    setSpinDirection(
      spinDirection === 'clockwise' ? 'counterclockwise' : 'clockwise',
    );
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

  const segments = [
    'better luck next time',
    'won 70',
    'won 10',
    'better luck next time',
    'won 2',
    'won uber pass',
  ];
  const segColors = ['#EE4040', '#F0CF50', '#815CD1', '#3DA5E0', '#34A24F'];
  const onFinished = (winner) => {
    console.log(winner);
  };

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

  console.log(version);

  const generateRandomNumber = (min, max) => {
    if (!mustSpin) {
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
      setPrizeNumber(newPrizeNumber);
      setSpinnerData(listArrayOfObjects);
      setMustSpin(true);

      // const newPrizeNumber = Math.floor(
      //   Math.random() * listArrayOfObjects.length,
      // );
      // setPrizeNumber(newPrizeNumber);
      // setSpinnerData(listArrayOfObjects);
      // setMustSpin(true);
    }
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
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ borderRadius: '50%', border: '2px solid black' }}
        />
        <Button
          onClick={startSpin}
          disabled={participants.length === 0 || spinning}
        >
          Spin1
        </Button>
        {/* <WheelComponent
          segments={segments}
          segColors={segColors}
          onFinished={(winner) => onFinished(winner)}
          primaryColor="black"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={false}
          size={190}
          upDuration={500}
          downDuration={600}
          fontFamily="Arial"
        /> */}
        {/* <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={spinnerData}
          spinDuration={0.1}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
        <button onClick={handleSpinClick}>SPIN</button> */}
        {prizeNumber !== undefined && (
          <div className="form-result">
            {prizeNumber}
            <div className="form-result-options">
              <button
                type="button"
                className="button-copy"
                onClick={() => copyToClipboard(prizeNumber)}
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
