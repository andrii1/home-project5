require('babel-register')({
  presets: ['es2015', 'react'],
});

const fetch = require('node-fetch');
const router = require('./sitemap-routes').default;
const Sitemap = require('react-router-sitemap').default;
const { WEATHER_CITIES } = require('./data');
const { NUMBERS } = require('./data');
const { RANDOM_NUMBER_DIGITS } = require('./data');
const { BREATHING_EXERCISE_DATA } = require('./data');

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

    const idMapNumbers = [];
    const idMapNumbersDigits = [];
    const idMapWheel = [];
    const idMapWeather = [];
    const idMapBreathing = [];

    NUMBERS.forEach((number) => {
      idMapNumbers.push({
        numberMinParam: number.numberMinParam,
        numberMaxParam: number.numberMaxParam,
      });
      idMapWheel.push({
        numberMinParam: number.numberMinParam,
        numberMaxParam: number.numberMaxParam,
      });
    });

    RANDOM_NUMBER_DIGITS.forEach((number) => {
      idMapNumbersDigits.push({
        numberOfNumbersParam: number.numberOfNumbersParam,
        numberOfDigitsParam: number.numberOfDigitsParam,
      });
    });

    WEATHER_CITIES.forEach((city) => {
      idMapWeather.push({
        cityParam: city,
      });
    });

    Object.keys(BREATHING_EXERCISE_DATA).forEach((key) => {
      idMapBreathing.push({
        typeOfExerciseParam: key,
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
      '/random-digit-number-generator/:numberOfNumbersParam/:numberOfDigitsParam':
        idMapNumbersDigits,
      '/random-number-wheel/:numberMinParam/:numberMaxParam': idMapWheel,
      '/weather-app/:cityParam': idMapWeather,
      '/breathing-app/:typeOfExerciseParam': idMapBreathing,
      // '/apps/:id': idMap,
      // '/apps/topic/:topicIdParam': idMapTopics,
      // '/apps/category/:categoryIdParam': idMapCategories,
    };

    return new Sitemap(router)
      .applyParams(paramsConfig)
      .build('https://www.miniappshub.com')
      .save('./public/sitemap.xml');
  } catch (e) {
    console.log(e);
  }
}

generateSitemap();
