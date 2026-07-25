/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

/* Get all questions */
const getQuestions = async () => {
  try {
    const questions = await knex('questions')
      .select(
        'questions.id as id',
        'questions.title as title',
        'questions.category_id as categoryId',
        'categories.title as categoryTitle',
      )
      .join('categories', 'questions.category_id', '=', 'categories.id');
    return questions;
  } catch (error) {
    return error.message;
  }
};

// Get Questions by Chapter
const getQuestionsByChapter = async (chapter) => {
  try {
    const questions = await knex('questions').where({ chapter_id: chapter });
    return questions;
  } catch (error) {
    return error.message;
  }
};

const getQuestionsById = async (id) => {
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
  getQuestionsById,
};
