/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

/* Get all questions */
const getQuestions = async () => {
  try {
    const questions = await knex('questions');
    return questions;
  } catch (error) {
    return error.message;
  }
};

// Get Questions by Chapter
const getQuestionsByChapter = async (chapter) => {
  try {
    const rows = await knex('questions')
      .leftJoin('answers', 'questions.id', 'answers.question_id')
      .leftJoin('users', 'users.id', 'answers.user_id')
      .where('questions.chapter_id', chapter)
      .select(
        'questions.id as question_id',
        'questions.title as question_title',
        'answers.id as answer_id',
        'answers.title as answer_title',
        'users.full_name as user_full_name',
      );

    const questions = rows.reduce((acc, row) => {
      let question = acc.find((q) => q.question_id === row.question_id);

      if (!question) {
        question = {
          question_id: row.question_id,
          question_title: row.question_title,
          answers: [],
        };

        acc.push(question);
      }

      if (row.answer_id) {
        question.answers.push({
          id: row.answer_id,
          title: row.answer_title,
          userFullName: row.user_full_name.split(' ')[0],
        });
      }

      return acc;
    }, []);

    return questions;
  } catch (error) {
    return error.message;
  }
};

const getQuestionById = async (id) => {
  if (!id) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const question = await knex('questions').where('questions.id', id);
    if (question.length === 0) {
      throw new Error(`incorrect entry with the id of ${id}`, 404);
    }
    return question;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getQuestions,
  getQuestionsByChapter,
  getQuestionById,
};
