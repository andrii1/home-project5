require('babel-register')({
  presets: ['es2015', 'react'],
});

const fetch = require('node-fetch');
const router = require('./sitemap-routes').default;
const Sitemap = require('react-router-sitemap').default;

async function generateSitemap() {
  try {
    // /* Prompts */
    // const response = await fetch(`http://localhost:5001/api/apps/`);
    // const promptsResult = await response.json();
    // const prompts = promptsResult.sort((a, b) => a.id - b.id);
    // const idMap = [];

    // /* Topics */
    // const responseTopics = await fetch(`http://localhost:5001/api/topics`);
    // const topicsResult = await responseTopics.json();
    // const topics = topicsResult.sort((a, b) => a.id - b.id);
    // const idMapTopics = [];

    // /* Categories */
    // const responseCategories = await fetch(
    //   `http://localhost:5001/api/categories`,
    // );
    // const categoriesResult = await responseCategories.json();
    // const categories = categoriesResult.sort((a, b) => a.id - b.id);
    // const idMapCategories = [];

    const numbers = [
      { numberMinParam: 0, numberMaxParam: 100 },
      { numberMinParam: 0, numberMaxParam: 10 },
      { numberMinParam: 0, numberMaxParam: 9 },
    ];
    const idMapNumbers = [];
    const idMapWheel = [];

    numbers.forEach((number) => {
      idMapNumbers.push({
        numberMinParam: number.numberMinParam,
        numberMaxParam: number.numberMaxParam,
      });
      idMapWheel.push({
        numberMinParam: number.numberMinParam,
        numberMaxParam: number.numberMaxParam,
      });
    });

    // prompts.forEach((prompt) => {
    //   idMap.push({ id: prompt.id });
    // });

    // topics.forEach((topic) => {
    //   idMapTopics.push({ topicIdParam: topic.id });
    // });

    // categories.forEach((category) => {
    //   idMapCategories.push({ categoryIdParam: category.id });
    // });

    const paramsConfig = {
      '/numbergenerator/:numberMinParam/:numberMaxParam': idMapNumbers,
      '/random-number-wheel/:numberMinParam/:numberMaxParam': idMapWheel,
      // '/apps/:id': idMap,
      // '/apps/topic/:topicIdParam': idMapTopics,
      // '/apps/category/:categoryIdParam': idMapCategories,
    };

    return new Sitemap(router)
      .applyParams(paramsConfig)
      .build('https://www.appswithai.xyz')
      .save('./public/sitemap.xml');
  } catch (e) {
    console.log(e);
  }
}

generateSitemap();
