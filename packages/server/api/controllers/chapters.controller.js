/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

/* Get all chapters */
const getChapters = async () => {
  try {
    const chapters = await knex('chapters')
      .select(
        'chapters.id as id',
        'chapters.title as title',
        'chapters.game_id as gameId',
        'games.title as gameTitle',
      )
      .join('games', 'chapters.game_id', '=', 'games.id');
    return chapters;
  } catch (error) {
    return error.message;
  }
};

// Get Chapters by Chapter
const getChaptersByGame = async (game) => {
  try {
    const chapters = await knex('chapters')
      .select(
        'chapters.*',
        'chapters.title as title',
        'chapters.game_id as gameId',
        'games.title as gameTitle',
        'games.slug as gameSlug',
      )
      .join('games', 'chapters.game_id', '=', 'games.id')
      .where({ game_id: game });
    return chapters;
  } catch (error) {
    return error.message;
  }
};

const getChapterById = async (id) => {
  if (!id) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const chapter = await knex('chapters')
      .select(
        'chapters.*',
        'chapters.title as title',
        'chapters.game_id as gameId',
        'games.title as gameTitle',
        'games.slug as gameSlug',
      )
      .join('games', 'chapters.game_id', '=', 'games.id')
      .where('chapters.id', id);
    if (chapter.length === 0) {
      throw new Error(`incorrect entry with the id of ${id}`, 404);
    }
    return chapter;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getChapters,
  getChaptersByGame,
  getChapterById,
};
