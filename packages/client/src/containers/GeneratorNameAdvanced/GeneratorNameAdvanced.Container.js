/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './GeneratorNameAdvanced.Style.css';
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
  { label: 'Elf', value: 'elf' },
  { label: 'Girl', value: 'jedi' },
  { label: 'Elf', value: 'zoo' },
  { label: 'Girl', value: 'dnd' },
  { label: 'Elf', value: 'bgmi' },
  { label: 'Girl', value: 'pubg' },
  { label: 'Elf', value: 'villain' },
  { label: 'Girl', value: 'username' },
  { label: 'Elf', value: 'japanese' },
  { label: 'Girl', value: 'last name' },
  { label: 'Girl', value: 'middle name' },
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
  const { tabParam = 'elf' } = useParams();

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
        <title>Random name generator</title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Random name generators</h1>
      </header>
      <section className="tab-group">
        <div className="tab-group">
          <Link to="/name-generator">
            <Button
              tertiary={tabParam === 'elf'}
              secondary={tabParam !== 'elf'}
              label="Elf name generator"
              className="tab"
            />
          </Link>
          <Button
            tertiary={tabParam === 'jedi'}
            secondary={tabParam !== 'jedi'}
            label="Jedi name generator"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'zoo'}
            secondary={tabParam !== 'zoo'}
            label="Planet zoo"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'dnd'}
            secondary={tabParam !== 'dnd'}
            label="dnd"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'bgmi'}
            secondary={tabParam !== 'bgmi'}
            label="bgmi"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'pubg'}
            secondary={tabParam !== 'pubg'}
            label="pubg"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'villain'}
            secondary={tabParam !== 'villain'}
            label="villain"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'username'}
            secondary={tabParam !== 'username'}
            label="username"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'japanese'}
            secondary={tabParam !== 'japanese'}
            label="japanese"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'last name'}
            secondary={tabParam !== 'last name'}
            label="last name"
            className="tab"
          />
          <Button
            tertiary={tabParam === 'middle name'}
            secondary={tabParam !== 'middle name'}
            label="middle name"
            className="tab"
          />
        </div>
      </section>
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
