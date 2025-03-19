/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './GeneratorName.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Dropdown } from '../../components/Dropdown/Dropdown.Component';

const keywords = [
  'generator name',
  'the name generator',
  'ai name generator',
  'baby name generator',
  'random name generator',
  'stylish name generator',
];

const tabs = [
  {
    label: 'Name',
    value: 'name',
    keywords: [
      'generator name',
      'the name generator',
      'ai name generator',
      'baby name generator',
      'random name generator',
      'stylish name generator',
    ],
  },
  { label: 'Middle name', value: 'middle-name' },
  { label: 'Last name', value: 'last-name' },
  { label: 'Username', value: 'username' },
  { label: 'Elf', value: 'elf' },
  { label: 'Jedi', value: 'jedi' },
  { label: 'Zoo', value: 'zoo' },
  { label: 'Dnd', value: 'dnd' },
  { label: 'Bgmi', value: 'bgmi' },
  { label: 'PUBG', value: 'pubg' },
  { label: 'Villain', value: 'villain' },
  { label: 'Japanese', value: 'japanese' },
];

const optionsGender = [
  { label: 'Boy', value: 'boy' },
  { label: 'Girl', value: 'girl' },
];

const optionsStyle = [
  { label: 'Classic', value: 'classic' },
  { label: 'Modern', value: 'modern' },
  { label: 'Unique', value: 'unique' },
];

export const GeneratorName = () => {
  const [gender, setGender] = useState('boy');
  const [style, setStyle] = useState('classic');
  const [nameData, setNameData] = useState();
  const [names, setNames] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { tabParam = 'name' } = useParams();

  useEffect(() => {
    setNames([]);
    setNameData('');
  }, [tabParam]);

  const tabsGroup = tabs.map((tab) => {
    return (
      <Link to={`/name-generator/${tab.value}`}>
        <Button
          tertiary={tabParam === tab.value}
          secondary={tabParam !== tab.value}
          label={tab.label}
          className="tab"
        />
      </Link>
    );
  });

  const fetchData = async (prompt) => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API}`,
          },
          body: JSON.stringify({
            model: 'gpt-4', // or "gpt-3.5-turbo"
            messages: [
              {
                role: 'system',
                content: `You are a name generator. ${
                  names.length > 0
                    ? `You are not using these names: ${names.join(', ')}`
                    : ''
                }`,
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.8, // Increases randomness
            max_tokens: 100, // Adjust for longer paragraphs
          }),
        },
      );

      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch');
      }

      if (data.choices && data.choices.length > 0) {
        setNameData(data.choices[0].message.content);
        setNames((prevNames) => [
          ...prevNames,
          data.choices[0].message.content,
        ]);
        setError(null);
      }
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  const handleInput = () => {
    let prompt;
    if (tabParam === 'name') {
      prompt = `Suggest a baby name for a ${gender} that is ${style} in style.`;
    } else if (tabParam === 'middle-name') {
      prompt = `Suggest a middle name for a ${gender} that is ${style} in style.`;
    } else if (tabParam === 'last-name') {
      prompt = `Suggest a last name for a ${gender} that is ${style} in style.`;
    } else if (tabParam === 'username') {
      prompt = `Generate a unique and elegant username.`;
    } else if (tabParam === 'elf') {
      prompt = `Generate a unique and elegant elf name.`;
    } else if (tabParam === 'jedi') {
      prompt = `Generate a unique and elegant Jedi name.`;
    } else if (tabParam === 'zoo') {
      prompt = `Generate one zoo name for Planet Zoo game. You can use these formulas:
      - [Name, sometimes I use a fictional character] Memorial Zoo
      - [Location] Central/City/State/National Zoo
      - [theme of zoo, like Reptile or Primate] Adventure Park / [theme of zoo] Park
      - The [location] [theme of zoo] Sanctuary
      - [Location and/or Theme] Reserve and Zoo
Here's a wiki that lists irl zoo names: https://en.wikipedia.org/wiki/List_of_zoos_by_country
As you can see, the vast majority are just the name of the location and then "Zoo" in whatever language is appropriate. Very, very few irl zoos have creative or engaging names.`;
    } else if (tabParam === 'dnd') {
      prompt = `Generate one dragon name for dnd game.`;
    } else if (tabParam === 'bgmi') {
      prompt = `Generate one username for Battlegrounds Mobile India game.`;
    } else if (tabParam === 'pubg') {
      prompt = `Generate one username for PUBG game with stylish symbols.`;
    } else if (tabParam === 'villain') {
      prompt = `Generate one villain name for some online game.`;
    } else if (tabParam === 'japanese') {
      prompt = `Generate one japanese name.`;
    }
    fetchData(prompt);
  };

  return (
    <main className="single-app-container">
      <Helmet>
        <title>Name generator</title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Name generator</h1>
      </header>
      <section className="tab-group">
        <div className="tab-group">{tabsGroup}</div>
      </section>
      <section className="app-input-container">
        <div className="search-input-container">
          {tabParam === 'name' ||
          tabParam === 'middle-name' ||
          tabParam === 'last-name' ? (
            <div className="dropdown-group">
              <Dropdown options={optionsGender} onSelect={setGender} />
              <Dropdown options={optionsStyle} onSelect={setStyle} />
            </div>
          ) : null}
          <Button onClick={handleInput} primary label="Generate name" />
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {nameData && !error && <div>{nameData}</div>}
          </>
        )}
      </section>
    </main>
  );
};
