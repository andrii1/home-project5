require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say hello',
        },
      ],
      max_tokens: 10,
    });

    console.log(result.choices[0].message.content);
  } catch (error) {
    console.log(error.status);
    console.log(error.message);
  }
}

test();
