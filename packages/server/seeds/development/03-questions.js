exports.seed = async function (knex) {
  await knex('questions').del();

  const questions = Array.from({ length: 20 }, (_, index) => ({
    question_id: String(index + 1),
    title: `Question ${index + 1}`,
    description: null,
    chapter_id: 2,
    url_image: null,
    meta_description: null,
  }));

  await knex('questions').insert(questions);
};
