/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');

const chapterId = 22;

const answerTitles = [
  'Vincent',
  'Errands',
  'Not planning to drink',
  '0814',
  'Walk',
  'Prescription',
  'You can talk',
  'Photos',
  'Draft',
  'Dr. Marcus Adler',
  'Lawyer',
  'iMessage',
  'Tucker',
  'Water',
  'Tim Piazza',
  '1:32 am',
  'BAC only',
  'Walk in for me',
  'Tucker',
  'Tucker & Marcus',
];

async function insertChapterAnswers() {
  const questions = await knex('questions')
    .where({ chapter_id: chapterId })
    .orderBy('id');

  const answers = questions.map((q, index) => ({
    title: answerTitles[index],
    question_id: q.id, // or q.question_id depending on schema
    user_id: 1,
  }));

  await knex('answers').insert(answers);

  console.log(`Inserted ${answers.length} answers for chapter ${chapterId}`);
}

insertChapterAnswers();
