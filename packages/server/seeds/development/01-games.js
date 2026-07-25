/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('games').del();
  await knex('games').insert([
    {
      id: 1,
      title: 'Stalkie · Mobile Detective',
      slug: 'stalkie',
      description: `Stalkie is an immersive narrative investigation game where you become a detective and dive into a fake phone filled with fake apps, hidden data, deleted photos, and secret conversations. Your mission as a detective is to explore every detail, connect the clues, and uncover the truth behind mysterious situations.

Each case puts you in the shoes of a mobile detective, analyzing messages, browsing social apps, checking notes, galleries, calendars, and locked content. Nothing is random: every contact, or app can hide a crucial clue. Think like a real detective, observe carefully, and trust your instincts.

Stalkie blends storytelling, puzzles, and investigation to create a unique experience where curiosity is your best tool. Can you spot the lies, reveal secrets, and solve the case before time runs out?

-

Some questions are available for free, and the full experience can be unlocked via an in-app purchase.

-

Privacy Policy: https://www.notion.so/Privacy-Policy-Stalkie-1f2e5143b6d280d5b393c4b26a8e9c91
Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
      url: 'https://stalkie-website.vercel.app',
      url_image:
        'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8f/7a/3d/8f7a3d84-1312-e059-9bac-cda32e64c9e8/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg',
      meta_description:
        'Dive into a fake phone, uncover secrets, and solve mysteries in Stalkie, the mobile detective game.',
      created_at: '2026-07-25 14:29:55.688427',
      summary:
        'Become a detective in Stalkie, an immersive narrative investigation game filled with hidden clues.',
      apple_id: '6745106241',
    },
    {
      id: 2,
      title: 'ColdTrace: Cold Case Mystery',
      slug: 'coldtrace',
      description: `A phone. A cold case. The truth is buried somewhere in between.

ColdTrace puts you inside a real investigation, or at least, it feels that way. Navigate a stranger's phone, piece together the timeline, and decide: was it really an accident?

AN IMMERSIVE FICTIONAL EXPERIENCE
• Explore a fully simulated phone interface: messages, photos, notes, voicemails
• Uncover a layered narrative where every clue matters
• Multiple threads to follow, one truth to uncover

FEEL THE TENSION
The line between player and investigator blurs. You're not watching the story unfold, you're living it. Every deleted file, every text thread, every timestamp brings you closer to the answer.

YOUR INVESTIGATION, YOUR PACE
ColdTrace is not a passive experience. What you read, what you dig into, and when, it all shapes your understanding of what happened.

For fans of interactive fiction, true crime podcasts, and crime documentaries who want to go deeper.

ColdTrace is a fictional narrative experience. All characters and events are entirely invented.

Note: Some chapters require a Premium unlock.

Some investigations are available for free, while the complete experience can be unlocked through an in-app purchase.

Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
      url: 'https://saclicstudio.com',
      url_image:
        'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e7/a4/30/e7a430ce-b933-d514-6859-16eb54f29063/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg',
      meta_description:
        'Immerse yourself in a fictional investigation, piecing together clues from a simulated phone interface.',
      created_at: '2026-07-25 14:29:56.976659',
      summary:
        "Investigate a cold case by exploring a stranger's phone and uncovering the truth.",
      apple_id: '6762513021',
    },
  ]);
};
