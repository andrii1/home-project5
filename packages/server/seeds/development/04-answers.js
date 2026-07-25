/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('answers').del();

  await knex('answers').insert([
    { title: 'Sara', question_id: 1, user_id: 1 },
    { title: 'medical clinic', question_id: 2, user_id: 1 },
    { title: 'Dr Bouchard’s office', question_id: 3, user_id: 1 },
    { title: '1007', question_id: 4, user_id: 1 },
    { title: 'Open calendar', question_id: 5, user_id: 1 },
    { title: '1018', question_id: 6, user_id: 1 },
    { title: 'Reiss Capital Fraud Review', question_id: 7, user_id: 1 },
    { title: 'Investigative journalist', question_id: 8, user_id: 1 },
    { title: 'Meridian files', question_id: 9, user_id: 1 },
    { title: 'messages', question_id: 10, user_id: 1 },
    { title: 'Files download', question_id: 11, user_id: 1 },
    { title: 'Files', question_id: 12, user_id: 1 },
    { title: 'Notes', question_id: 13, user_id: 1 },
    { title: 'Black jacket', question_id: 14, user_id: 1 },
    { title: 'Followed on foot', question_id: 15, user_id: 1 },
    { title: 'Referral', question_id: 16, user_id: 1 },
    { title: 'I documented it', question_id: 17, user_id: 1 },
    { title: 'Security alert', question_id: 18, user_id: 1 },
    { title: 'Email', question_id: 19, user_id: 1 },
    { title: 'Send an email', question_id: 20, user_id: 1 },
  ]);
};
