/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './BratGenerator.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { CardSimple } from '../../components/CardSimple/CardSimple.component';
import TextFormInput from '../../components/Input/TextFormInput.component';
import { capitalize } from '../../utils/capitalize';
import TextFormTextarea from '../../components/Input/TextFormTextarea.component';
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

const keywords = [
  'brat generator',
  'free brat generator',
  'brat green hex',
  'charli xcx brat generator',
  'bratgenerator',
  'brat text',
  'brat album generator',
  'brat meme',
  'brat cover',
  'brat maker',
];

const defaultColors = ['#8acf00', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'];

export const BratGenerator = () => {
  const [input, setInput] = useState();
  const [recipesData, setRecipesData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState('#8acf00');
  const [colorPickerSelected, setColorPickerSelected] = useState(false);
  const bratWrapperRef = useRef();

  const handleChangeColor = (colorParam) => {
    setColorPickerSelected(false);
    setColor(colorParam);
  };

  const downloadPNG = () => {
    const bratWrapper = bratWrapperRef.current;

    // Set canvas dimensions to 512x512 px
    const width = 512;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Apply blur filter to the background
    ctx.filter = 'blur(3px)';
    ctx.fillStyle = color; // Set background color
    ctx.fillRect(0, 0, width, height); // Draw the background

    // Apply blur to the text (line-height simulation and blur filter)
    ctx.filter = 'blur(1px)'; // Apply blur to text (adjust as needed)
    ctx.font = '700 47.7px "Roboto", sans-serif'; // Set font size
    ctx.textAlign = 'center'; // Align text in the center horizontally
    ctx.textBaseline = 'middle'; // Align text in the center vertically

    const textX = width / 2; // Center the text horizontally
    const textY = height / 2; // Center the text vertically

    // Draw the text (apply line height)
    ctx.fillStyle = 'black'; // Set text color to white
    ctx.fillText(input, textX, textY);

    // Convert canvas content to PNG image
    const imgData = canvas.toDataURL('image/png');

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'brat-image.png'; // Set file name
    link.click();
  };

  return (
    <main className="single-app-container">
      <Helmet>
        <title>Brat generator</title>
        <meta
          name="description"
          content={keywords.length > 0 && keywords.join(', ')}
        />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Brat generator</h1>
      </header>
      <section className="app-input-container">
        <div className="search-input-container">
          <TextFormTextarea
            value={input}
            placeholder="Enter text..."
            onChange={setInput}
          />
          <div className="color-group">
            {defaultColors.map((item) => (
              <button
                type="button"
                className={`color-input ${item === color && 'selected'}`}
                style={{ backgroundColor: item }}
                onClick={() => handleChangeColor(item)}
              />
            ))}
            <input
              type="color"
              className={`color-picker ${colorPickerSelected && 'selected'}`}
              onChange={(event) => {
                setColor(event.target.value);
                setColorPickerSelected(true);
              }}
            />
          </div>
          {/* <Button onClick={handleInput} primary label="Search" /> */}
        </div>
      </section>
      <section className="app-result-container">
        <div className="brat-wrapper" ref={bratWrapperRef}>
          <div className="brat-container" style={{ backgroundColor: color }} />
          <div className="brat-text">{input}</div>
        </div>
        <Button onClick={downloadPNG} primary label="Download" />
        {/* {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {recipesData && !error && (
              <div className="container-cards">{recipes}</div>
            )}
          </>
        )} */}
      </section>
      <section>
        {' '}
        <div className="guide-container">
          <h1>Brat Generator - Full Guide</h1>

          <p>
            In the world of online culture, memes, and creative self-expression,
            the <strong>brat generator</strong> has emerged as a fun and quirky
            tool that resonates with many, especially among Gen Z. If
            you&apos;re unfamiliar with this internet sensation, you&apos;ve
            likely encountered the term in some way, whether through social
            media trends, fan pages, or TikTok videos. With its roots in pop
            culture and music, particularly the{' '}
            <strong>Charli XCX brat trend</strong>, the{' '}
            <strong>brat generator</strong> is something you&apos;ll want to
            know about. This guide will break down everything you need to
            understand, from the history of the{' '}
            <strong>Charli XCX brat trend</strong> to how you can create your
            own personalized <strong>brat text</strong> and embrace this unique
            meme culture.
          </p>

          <h2>Charli XCX Brat Trend - History</h2>
          <p>
            Before diving into the <strong>brat generator</strong>, it&apos;s
            important to understand the cultural context that birthed this
            creative tool. The <strong>Charli XCX brat trend</strong> has its
            roots in Charli XCX&apos;s music and her persona as an experimental
            pop artist who often embraces avant-garde aesthetics.
          </p>
          <p>
            In 2020, Charli XCX released her album &quot;How I&apos;m Feeling
            Now,&quot; an album made during the early days of the pandemic.
            Among the experimental themes of the album, the track
            &quot;Brat&quot; quickly became a fan favorite. Its rebellious,
            upbeat, and unapologetic lyrics resonated with fans, and the
            &quot;brat&quot; aesthetic was born. Fans embraced the idea of
            channeling their inner brat, with its carefree and sometimes chaotic
            energy.
          </p>
          <p>
            The <strong>brat meme</strong> evolved from this, becoming
            synonymous with a playful, defiant, and mischievous attitude. This
            idea was quickly adopted and adapted by Charli XCX&apos;s fanbase,
            leading to the creation of the <strong>brat generator</strong>,
            which allowed users to generate their own brat-like texts, images,
            and memes.
          </p>

          <h2>What is a Brat Generator?</h2>
          <p>
            The <strong>brat generator</strong> is a digital tool that allows
            users to create <strong>brat text</strong>, often in the style of a
            rebellious, quirky, and playful character. This generator is a
            direct result of the <strong>brat meme</strong>, which draws
            inspiration from Charli XCX&apos;s music, particularly her song
            &quot;Brat.&quot; A <strong>brat generator</strong> typically allows
            you to input text, which it then transforms into bold, colorful, and
            often playful or sassy fonts. It&apos;s used to generate
            personalized text, often for social media profiles, memes, and
            creative visual content.
          </p>
          <p>
            But what makes the brat generator so unique is its customization
            options. From choosing your preferred font style to selecting the
            iconic <strong>brat green hex</strong> (a neon, high-energy color
            associated with the brat aesthetic), users can personalize their
            generated content to fit their desired vibe. Whether you&apos;re
            looking for a <strong>brat album generator</strong> to create cover
            art or just want to add some fun, rebellious flair to your posts,
            the brat generator makes it easy.
          </p>

          <h2>How Does a Brat Generator Work?</h2>
          <p>
            The process of using a <strong>brat generator</strong> is simple and
            accessible to all users, even those with minimal graphic design or
            coding skills. Here&apos;s how it typically works:
          </p>
          <ul>
            <li>
              <strong>1. Choose Your Brat Generator Tool:</strong> There are
              several <strong>free brat generators</strong> available online.
              These tools are often easy to use and don&apos;t require any
              downloads or advanced knowledge. Simply search for &quot;brat
              generator&quot; or &quot;free brat generator&quot; on your
              preferred search engine to find one that suits your needs. Some
              popular sites include meme generators and specialized text
              customization platforms.
            </li>
            <li>
              <strong>2. Input Your Text:</strong> Once you&apos;ve selected a{' '}
              <strong>brat generator</strong>, you&apos;ll be prompted to enter
              the text you want to convert into brat-inspired font. This can be
              anything from a catchy phrase, a meme, or even a fun sentence in
              the style of a brat.
            </li>
            <li>
              <strong>3. Customize Your Design:</strong> Most brat generators
              offer customization options, including font styles, colors, and
              effects. One of the most iconic features of a{' '}
              <strong>brat generator</strong> is the{' '}
              <strong>brat green hex</strong> (#00FF00), a vibrant, eye-catching
              shade of green that&apos;s used to convey the bratty,
              punk-inspired vibe of Charli XCX&apos;s aesthetic. You can also
              select other colors, add gradients, or tweak the background
              settings.
            </li>
            <li>
              <strong>4. Generate Your Brat Text or Image:</strong> Once
              you&apos;ve set up your desired options, hit the
              &ldquo;Generate&rdquo; button. The tool will instantly create your
              brat-inspired text or image. You can use the result as a meme,
              profile image, or even a <strong>brat cover</strong> for your
              social media accounts.
            </li>
            <li>
              <strong>5. Download and Share:</strong> After generating your brat
              text or image, you can download it to your device or directly
              share it on social media. The best part? If you&apos;re using a{' '}
              <strong>free brat generator</strong>, you don&apos;t have to worry
              about any hidden costs.
            </li>
          </ul>

          <h2>Benefits of Using a Brat Generator</h2>
          <p>
            The <strong>brat generator</strong> offers several benefits,
            especially for creative individuals looking to add personality and
            flair to their digital presence. Here are a few reasons why the{' '}
            <strong>brat generator</strong> is so popular:
          </p>
          <ul>
            <li>
              <strong>1. Easy Customization:</strong> With a brat generator, you
              don&apos;t need to have any design skills. The tool does all the
              hard work, giving you access to pre-designed fonts, effects, and
              colors. You simply input your text and watch it come to life.
            </li>
            <li>
              <strong>2. Stand Out on Social Media:</strong> If you&apos;re
              looking to create eye-catching, bold content for platforms like
              Instagram, TikTok, or Twitter, the brat generator is a fun way to
              create unique posts. Whether you&apos;re using it for{' '}
              <strong>brat text</strong>, meme creation, or cover art, it will
              help you stand out in a sea of ordinary posts.
            </li>
            <li>
              <strong>3. Creative Expression:</strong> The brat generator lets
              you express your individuality. By using brat-inspired fonts and
              colors, you&apos;re not only participating in a meme culture but
              also embracing a carefree and rebellious attitude that aligns with
              the <strong>Charli XCX brat trend</strong>.
            </li>
            <li>
              <strong>4. Perfect for Memes:</strong> The{' '}
              <strong>brat meme</strong> has exploded in popularity, and using a
              brat generator allows you to make your own version of this meme.
              With the ability to create fun, playful, and sassy text, you can
              join in on the meme culture and add your personal touch.
            </li>
          </ul>

          <h2>How to Choose the Right Brat Generator for Your Needs</h2>
          <p>
            There are several brat generators available online, each offering
            unique features. Here are some tips to help you choose the right
            one:
          </p>
          <ul>
            <li>
              <strong>1. Look for Customization Options:</strong> Ensure that
              the brat generator you choose offers a wide variety of font
              styles, colors, and effects. If you&apos;re specifically looking
              for <strong>brat green hex</strong>, check that the tool allows
              you to select this iconic color.
            </li>
            <li>
              <strong>2. Consider Ease of Use:</strong> Choose a generator that
              is easy to navigate. Since the brat generator is meant to be fun
              and creative, you don&apos;t want to get bogged down by
              complicated tools.
            </li>
            <li>
              <strong>3. Free vs. Paid:</strong> While many{' '}
              <strong>free brat generators</strong> are available, some may
              offer premium features for a fee. If you&apos;re just looking for
              a simple <strong>brat maker</strong>, a free tool will likely be
              sufficient.
            </li>
            <li>
              <strong>4. Look for Meme-Specific Features:</strong> Some brat
              generators are designed specifically for creating{' '}
              <strong>brat memes</strong> or <strong>brat covers</strong> for
              social media. If this is your primary goal, choose a tool that has
              meme-specific templates and options.
            </li>
          </ul>

          <h2>What is the Right Brat Green Hex and Brat Font?</h2>
          <p>
            The <strong>brat green hex</strong> is a key element of the brat
            aesthetic. It&apos;s a neon, vibrant green color (#00FF00) that
            conveys energy, defiance, and rebellion—qualities associated with
            the <strong>brat</strong> persona. When using a brat generator, be
            sure to select this hex code to keep your text or design true to the
            brat vibe.
          </p>
          <p>
            As for the <strong>brat font</strong>, there isn&apos;t one specific
            font that defines the brat style. However, fonts that are bold,
            rebellious, and slightly distorted are commonly used. Look for fonts
            that resemble graffiti, neon lights, or retro 90s aesthetics to get
            that brat-like feel.
          </p>

          <h2>Conclusion</h2>
          <p>
            The <strong>brat generator</strong> is a fun and creative tool that
            lets you embrace the playful, rebellious spirit of the Charli XCX
            brat trend. Whether you&apos;re looking to create{' '}
            <strong>brat memes</strong>, add a unique touch to your social media
            posts, or simply experiment with different fonts and colors, the
            brat generator gives you the freedom to do so in an easy-to-use
            platform. Embrace your inner brat and let your creativity shine!
          </p>
        </div>
      </section>
    </main>
  );
};
