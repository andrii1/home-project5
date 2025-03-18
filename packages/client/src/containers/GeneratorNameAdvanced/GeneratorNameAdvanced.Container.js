/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
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

const optionsGender = [
  { label: 'Boy', value: 'boy' },
  { label: 'Girl', value: 'girl' },
];

const optionsStyle = [
  { label: 'Classic', value: 'classic' },
  { label: 'Modern', value: 'modern' },
  { label: 'Unique', value: 'unique' },
];

export const GeneratorNameAdvanced = () => {
  const [gender, setGender] = useState('boy');
  const [style, setStyle] = useState('classic');
  const [nameData, setNameData] = useState();
  const [names, setNames] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

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
                content: `You are a baby name generator. ${
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
    const prompt = `Suggest a baby name for a ${gender} that is ${style} in style.`;
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
      <section className="app-input-container">
        <div className="search-input-container">
          <div className="dropdown-group">
            <Dropdown options={optionsGender} onSelect={setGender} />
            <Dropdown options={optionsStyle} onSelect={setStyle} />
          </div>
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
