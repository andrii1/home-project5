/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');

const chapterId = 25;

const answerTitles = [
  'Zoe',
  'suicide',
  '11.04',
  'Stop',
  'Keeper',
  'Spyware',
  '8 months',
  'Location, camera, microphone',
  'Apartment',
  'Oct 18',
  'Marcus Webb',
  'Voice memo',
  'Zoe recording',
  'Hannah',
  'Pounds',
  'Not the first one',
  'Pills',
  'Check keeper app',
  'Airdrop',
  'Is it done',
  'October 14',
  'Marcus, Hanna',
];

// const chapterIdDanny = 24;

// const answerTitlesDanny = [
//   'Daniel',
//   'Sebastian',
//   'liar',
//   '6',
//   'Romford',
//   'Eyes',
//   'Alessandro Conti',
//   'Frozen',
//   'nadia',
//   'Vale',
//   '74000',
//   'Gift',
//   'Definitely',
//   'G. Cole',
//   'Vault',
//   'Yacht photo',
//   'Police',
//   'Deal',
//   'Wathamstow',
//   'Gemma Cole, Daniel Cole',
// ];

// async function insertChapterAnswers() {
//   const questions = await knex('questions')
//     .where({ chapter_id: chapterId })
//     .orderBy('id');

//   const answers = questions.map((q, index) => ({
//     title: answerTitles[index],
//     question_id: q.id, // or q.question_id depending on schema
//     user_id: 1,
//   }));

//   await knex('answers').insert(answers);

//   console.log(`Inserted ${answers.length} answers for chapter ${chapterId}`);
// }

async function insertChapterAnswers(chapterParam, answersParam) {
  const questions = await knex('questions')
    .where({ chapter_id: chapterParam })
    .orderBy('id');

  const answers = questions.map((q, index) => ({
    title: answersParam[index],
    question_id: q.id, // or q.question_id depending on schema
    user_id: 1,
  }));

  await knex('answers').insert(answers);

  console.log(`Inserted ${answers.length} answers for chapter ${chapterParam}`);
}

insertChapterAnswers(chapterId, answerTitles);
