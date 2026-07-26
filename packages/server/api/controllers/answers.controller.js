/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

/* Get all answers */
const getAnswers = async () => {
  try {
    const answers = await knex('answers')
      .select('answers.*', 'users.full_name as fullName')
      .leftJoin('users', 'users.id', 'answers.user_id');
    return answers;
  } catch (error) {
    return error.message;
  }
};

// Get answers by Category
const getAnswersByQuestion = async (question) => {
  try {
    const answers = await knex('answers')
      .select('answers.*', 'users.full_name as fullName')
      .leftJoin('users', 'users.id', 'answers.user_id')
      .where({ question_id: question });
    return answers;
  } catch (error) {
    return error.message;
  }
};

const getAnswersById = async (id) => {
  if (!id) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const answer = await knex('answers').where('answers.id', id);
    if (answer.length === 0) {
      throw new Error(`incorrect entry with the id of ${id}`, 404);
    }
    return answer;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getAnswers,
  getAnswersByQuestion,
  getAnswersById,
};
