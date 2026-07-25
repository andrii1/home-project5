/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

const getGames = async () => {
  return knex('games');
};

const getGameById = async (slug) => {
  if (!slug) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const game = await knex('games').where('games.slug', slug);
    if (game.length === 0) {
      throw new Error(`incorrect entry with the id of ${slug}`, 404);
    }
    return game;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getGames,
  getGameById,
};
