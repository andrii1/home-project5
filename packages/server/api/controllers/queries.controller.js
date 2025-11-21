/* eslint-disable no-unused-vars */
/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');
require('dotenv').config();

const USER_UID = process.env.USER_UID_MAH_PROD;

const getQueries = async ({
  token,
  days = null,
  sources,
  sites,
  column,
  direction,
}) => {
  const userUid = token.split(' ')[1];
  const correctUser = userUid === USER_UID;
  // const user = (await knex('users').where({ uid: userUid }))[0];

  if (!token) {
    throw new HttpError('There are not users', 401);
  }

  if (!correctUser) {
    throw new HttpError('Access denined for user', 401);
  }

  try {
    let queryBuilder = knex('queries')
      .select('queries.*', 'sites.title as siteTitle')
      .join('sites', 'queries.site_id', '=', 'sites.id');

    if (days) {
      // Filter queries from the last X days
      queryBuilder = queryBuilder.where(
        'created_at',
        '>=',
        knex.raw(`NOW() - INTERVAL ? DAY`, [days]),
      );
    }

    if (sources === 'apps') {
      // Filter queries from the last X days
      queryBuilder = queryBuilder.where('source', 'like', '%app%');
    }

    if (sources === 'not-apps') {
      // Filter queries from the last X days
      queryBuilder = queryBuilder.where('source', 'not like', '%app%');
    }

    if (sites) {
      queryBuilder = queryBuilder.where('site_id', sites);
    }

    const queries = await queryBuilder.orderBy(
      column || 'created_at',
      direction || 'desc',
    );

    return queries;
  } catch (error) {
    return error.message;
  }
};

const createQuery = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    // Optional: check for existing tag
    const existing = await knex('queries')
      .whereRaw('LOWER(title) = ?', [body.title.toLowerCase()])
      .first();

    if (existing) {
      return {
        successful: true,
        existing: true,
        queryId: existing.id,
      };
    }

    const [queryId] = await knex('queries').insert({
      title: body.title.toLowerCase(),
      value: body.value,
      status: false,
      source: body.source,
    });

    return {
      successful: true,
      queryId,
      queryTitle: body.title,
    };
  } catch (error) {
    return error.message;
  }
};

const editQuery = async (queryId, updatedQuery) => {
  if (!queryId) {
    throw new HttpError('No query', 400);
  }

  const updateData = Object.fromEntries(
    Object.entries(updatedQuery).filter(([_, v]) => v !== undefined),
  );

  return knex('queries').where({ id: queryId }).update(updateData);
};

module.exports = {
  createQuery,
  getQueries,
  editQuery,
};
