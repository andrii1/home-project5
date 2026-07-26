/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');

const chapterId = 21;

const answerTitles = [
  'Sara',
  'medical clinic',
  'Dr Bouchard’s office',
  '1007',
  'Open calendar',
  '1018',
  'Reiss Capital Fraud Review',
  'Investigative journalist',
  'Meridian files',
  'messages',
  'Files download',
  'Files',
  'Notes',
  'Black jacket',
  'Followed on foot',
  'Referral',
  'I documented it',
  'Security alert',
  'Email',
  'Send an email',
];

async function insertChapterAnswers() {
  const questions = await knex('questions')
    .where({ chapter_id: chapterId })
    .orderBy('question_id');

  const answers = questions.map((q, index) => ({
    title: answerTitles[index],
    question_id: q.id, // or q.question_id depending on schema
    user_id: 1,
  }));

  await knex('answers').insert(answers);

  console.log(`Inserted ${answers.length} answers for chapter ${chapterId}`);
}

insertChapterAnswers();
