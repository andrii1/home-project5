/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import './CharacterHeadcanonGenerator.Style.css';
import { Button } from '../../components/Button/Button.component';
import TextFormInput from '../../components/Input/TextFormInput.component';

const keywords = [
  'Character headcanon generator',
  'character headcanon ai',
  'ai character headcanon generator',
];

export const CharacterHeadcanonGenerator = () => {
  const [characterName, setCharacterName] = useState();
  const [characterData, setCharacterData] = useState();
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
                content:
                  'You are character headcanon generator. You generate spicy character headcanons, ideally 4-8 words long, maximum 20 words long.',
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
        setCharacterData(data.choices[0].message.content);
        setError(null);
      }
    } catch (e) {
      setError({ message: e.message || 'An error occured' });
    }
    setLoading(false);
  };

  const handleCharacterName = () => {
    const prompt = characterName
      ? `Generate a unique headcanon for the character named ${characterName}.`
      : 'Generate a random unique character headcanon.';
    fetchData(prompt);
  };

  return (
    <main className="single-app-container">
      <Helmet>
        <title>Character headcanon generator</title>
        <meta name="description" content={keywords && keywords.join(', ')} />
      </Helmet>
      <header className="hero">
        <h1 className="hero-header">Character headcanon generator</h1>
      </header>
      <section className="app-input-container">
        <div className="search-input-container">
          <TextFormInput
            value={characterName}
            placeholder="Enter character name"
            onChange={setCharacterName}
          />
          <Button
            onClick={handleCharacterName}
            primary
            label="Create headcanon"
          />
        </div>
      </section>
      <section className="app-result-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <p className="error-message">{error.message}</p>}
            {characterData && !error && <div>{characterData}</div>}
          </>
        )}
      </section>
    </main>
  );
};
