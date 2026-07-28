/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');

const chapterIdRei = 23;

const answerTitlesRei = [
  'May 17',
  'spark',
  'Check the studio',
  'none',
  'Injections',
  'mother signed',
  'Switch',
  'Han Jiwon',
  'AETHER_practice_backup',
  'Voice memos',
  'Cafe Vert',
  'Kang',
  'Confidential',
  'Sign',
  'Choi',
  'Madame park',
  'Hi',
  'school',
  'File',
  'Director Park & Madame Park',
];

const chapterIdDanny = 24;

const answerTitlesDanny = [
  'Daniel',
  'Sebastian',
  'liar',
  '6',
  'Romford',
  'Eyes',
  'Alessandro Conti',
  'Frozen',
  'nadia',
  'Vale',
  '74000',
  'Gift',
  'Definitely',
  'G. Cole',
  'Vault',
  'Yacht photo',
  'Police',
  'Deal',
  'Wathamstow',
  'Gemma Cole, Daniel Cole',
];

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

insertChapterAnswers(chapterIdRei, answerTitlesRei);
insertChapterAnswers(chapterIdDanny, answerTitlesDanny);
