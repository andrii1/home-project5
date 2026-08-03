/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');

const chapterId = 1;

const answerTitles = [
  'Thomas Smith',
  'Do not answer',
  'So',
  'Tinder',
  'Restaurant',
  'Le Croquant',
  'Versailles',
  '400',
  'Battery',
  '334521',
  'Sophie Mercer',
  '26',
  'Versailles',
  'Chanel',
  'Tired',
];

const chapterId2 = 2;

const answerTitles2 = [
  'Léa',
  'WhatsApp',
  'Photos',
  '030103',
  'Jeweler',
  'Engagement',
  'Cartier',
  'Yellow',
  'Por la',
  'Hugo',
  'Florist',
  'Nice',
  'Restaurant',
  'Phone',
  'July',
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

  const answers = questions
    .map((q, index) => ({
      title: answersParam[index],
      question_id: q.id, // or q.question_id depending on schema
      user_id: 1,
    }))
    .filter((answer) => answer.title !== undefined && answer.title !== null);

  await knex('answers').insert(answers);

  console.log(`Inserted ${answers.length} answers for chapter ${chapterParam}`);
}

insertChapterAnswers(chapterId, answerTitles);
insertChapterAnswers(chapterId2, answerTitles2);
