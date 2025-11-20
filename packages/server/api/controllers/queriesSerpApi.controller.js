/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const HttpError = require('../lib/utils/http-error');
require('dotenv').config();
const useAllQueries = require('../lib/utils/serpApi');

const USER_UID = process.env.USER_UID_MAH_PROD;

const createQueries = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const correctUser = userUid === USER_UID;

    if (!token) {
      throw new HttpError('There are not users', 401);
    }

    if (!correctUser) {
      throw new HttpError('Access denined for user', 401);
    }
    const { period, seedList, includeCategories } = body;
    if (!period || !['1', '7', '30'].includes(period.toString())) {
      throw new HttpError('period must be 1, 7, or 30 days', 401);
    }

    if (!Array.isArray(seedList) || seedList.length === 0) {
      throw new HttpError('seedList must be a non-empty array', 401);
    }

    const queries = await useAllQueries(period, seedList, includeCategories);

    return {
      successful: true,
      count: queries.length,
      queries,
    };
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  createQueries,
};
