/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
// const fetch = require("node-fetch");

require('dotenv').config();
const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const createQuotesChatGptBasedOnQuery = require('../serpApi/useChatGptApi.js');
const getSearchQueries = require('./useSearchConsoleApi.js');
const cleanUp = require('../cleanUpQuotes.js');
const { capitalize } = require('../../../../../client/src/utils/capitalize.js');

// Register the Norwester font
registerFont(path.resolve(__dirname, 'norwester', 'norwester.otf'), {
  family: 'Norwester',
});

const today = new Date();
const isSunday = today.getDay() === 0; // 0 = Sunday

if (!isSunday) {
  console.log('Not Sunday, skipping weekly job.');
  process.exit(0);
}

// Credentials (from .env)
const USER_UID = process.env.USER_UID_MOT_PROD;
const API_PATH = process.env.API_PATH_MOT_PROD;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// fetch helpers
async function fetchExistingQuotes() {
  const res = await fetch(`${API_PATH}/quotes`);
  return res.json();
}

async function fetchExistingAuthors() {
  const res = await fetch(`${API_PATH}/authors`);
  return res.json();
}

async function insertAuthor(name) {
  const res = await fetch(`${API_PATH}/authors`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name: name }),
  });
  return await res.json(); // assume it returns { id, full_name }
}

// Define canvas dimensions
const width = 1000;
const height = 1500;
const lineHeight = 120;

// Function to wrap text to fit within canvas width
function wrapText(ctx, text, x, y, maxWidth) {
  const words = text.split(' ');
  let line = '';
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return lines.length;
}

async function insertQuote(quoteObj) {
  const res = await fetch(`${API_PATH}/quotes`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
  });
  return await res.json(); // assume it returns { id, title }
}

async function updateQuote(quoteId, quoteObj) {
  const res = await fetch(`${API_PATH}/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
  });
  if (!res.ok) {
    const errorBody = await res.text(); // <- read text, not json
    console.error(`Failed to update quote (${res.status}):`, errorBody);
    throw new Error(`Failed to update quote: ${res.statusText}`);
  }
  console.log('Updated quote:', quoteObj);
  return await res.json();
}

async function insertQuery(queryObj) {
  const res = await fetch(`${API_PATH}/queries`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryObj),
  });
  return await res.json(); // assume it returns { id, title }
}

// Upload to AWS S3
async function uploadToS3(imagePath, filename) {
  const fileContent = fs.readFileSync(imagePath);
  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `quotes/${filename}`,
    Body: fileContent,
    ContentType: 'image/png',
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('Uploaded to S3:', data.Location);
    return data;
  } catch (err) {
    console.error('S3 Upload Error:', err);
    return null;
  }
}

// Upload to AWS S3
async function uploadToS3Buffer(filename, buffer) {
  // const fileContent = fs.readFileSync(imagePath);
  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `quotes/${filename}`,
    Body: buffer,
    ContentType: 'image/png',
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('Uploaded to S3:', data.Location);
    return data;
  } catch (err) {
    console.error('S3 Upload Error:', err);
    return null;
  }
}

// Function to get the quote and author
function getQuoteAndAuthor(quote) {
  const match = quote.match(/^(.*?)[\s"”]?[–-]\s*([\w\s.]+)$/);
  if (match) {
    return { text: match[1].trim(), author: match[2].trim() };
  }
  return { text: quote.trim(), author: 'Unknown' };
}

function getUniqueFolderName(baseFolderPath) {
  let folderPath = baseFolderPath;
  let counter = 1;

  // Check if the folder exists and if so, create a unique name
  while (fs.existsSync(folderPath)) {
    folderPath = `${baseFolderPath}(${counter})`;
    counter++;
  }

  return folderPath;
}

// Define the async function to create a post

const createPost = async (postDataParam) => {
  try {
    const response = await fetch(`${API_PATH}/blogs`, {
      method: 'POST',
      headers: {
        token: `token ${USER_UID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postDataParam),
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('Post created successfully:', data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

const createQuotes = async () => {
  const baseFolderPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    'Downloads',
    'quotes_images',
  );

  // Get a unique folder path by checking for conflicts
  const imagesFolderPath = getUniqueFolderName(baseFolderPath);

  // Create the folder if it doesn't exist
  fs.mkdirSync(imagesFolderPath, { recursive: true });

  let count = 0;

  const existingQuotes = await fetchExistingQuotes();
  const existingAuthors = await fetchExistingAuthors();
  // const existingTags = await fetchExistingTags();

  const quoteMap = new Map(
    existingQuotes.map((q) => [q.title.toLowerCase().trim(), q.id]),
  );
  const authorMap = new Map(
    existingAuthors.map((a) => [
      a.fullName.toLowerCase().trim(),
      { id: a.id, fullName: a.fullName },
    ]),
  );
  const queries = await getSearchQueries();
  console.log('queries', queries);
  // const queries = ['inspirational quotes'];
  for (const query of queries) {
    const newQuery = await insertQuery({
      title: query,
    });

    if (newQuery.existing) {
      console.log('Duplicate query skipped:', query);
      continue;
    }
    const quotes = await createQuotesChatGptBasedOnQuery(query);
    // const quotes = ['test quote is here2'];
    console.log('quotes', quotes);

    const tag = cleanUp(query);

    const quotesReadyForBlog = [];

    for (const quote of quotes) {
      const { text, author } = getQuoteAndAuthor(quote);
      const wordCount = text.trim().split(/\s+/).length;

      // // Skip if quote exists
      // if (quoteMap.has(text.toLowerCase())) {
      //   console.log('Duplicate quote skipped:', text);
      //   continue;
      // }

      if (wordCount > 38) {
        console.log('Too big quote skipped:', text);
        continue;
      }

      // Get or insert author
      let authorId;
      let authorFullName;
      const normalizedAuthor = author.toLowerCase().trim();

      if (authorMap.has(normalizedAuthor)) {
        const authorData = authorMap.get(normalizedAuthor);
        authorId = authorData.id;
        authorFullName = authorData.fullName;
      } else {
        const newAuthor = await insertAuthor(author);
        authorId = newAuthor.authorId;
        authorFullName = newAuthor.authorFullName;
        authorMap.set(normalizedAuthor, {
          id: authorId,
          fullName: authorFullName,
        });
      }

      // New quote
      console.log('Inserting quote:', text);
      const newQuote = await insertQuote({
        title: text,
        author_id: authorId,
        user_id: '1',
        tag,
      });

      // Skip if quote exists
      if (newQuote.existing && newQuote.imageUrl) {
        quotesReadyForBlog.push({
          id: newQuote.quoteId,
          title: text,
          author: authorFullName,
          imageUrl: newQuote.imageUrl,
        });
        console.log('Duplicate quote with image skipped:', text);
        continue;
      }

      // generate quote image

      // const text = quote.title;
      // const author = quote.author;
      // console.log('quote id', quote.id);
      // const wordCount = text.trim().split(/\s+/).length;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#252525';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'white';
      if (wordCount < 35) {
        ctx.font = "85px 'Norwester'";
      } else {
        ctx.font = "35px 'Norwester'";
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const textUpperCase = text.toUpperCase();
      const numberOfLines = wrapText(
        ctx,
        textUpperCase,
        width / 2,
        height * 0.2,
        width * 0.9,
      );
      const totalTextHeight = numberOfLines * lineHeight;
      const centerY = (height - totalTextHeight) / 2;

      const canvas2 = createCanvas(width, height);
      const ctx2 = canvas2.getContext('2d');

      ctx2.fillStyle = '#252525';
      ctx2.fillRect(0, 0, width, height);
      ctx2.fillStyle = 'white';
      if (wordCount < 35) {
        ctx2.font = "85px 'Norwester'";
      } else {
        ctx2.font = "35px 'Norwester'";
      }
      ctx2.textAlign = 'center';
      ctx2.textBaseline = 'top';

      wrapText(ctx2, textUpperCase, width / 2, centerY, width * 0.9);

      if (author !== 'Unknown') {
        const authorUpperCase = author.toUpperCase();
        ctx2.font = "45px 'Norwester'";
        ctx2.fillText(`– ${authorUpperCase}`, width / 2, height - 150);
      }

      const filename = `${uuidv4()}.png`;
      // const imagePath = path.join(imagesFolderPath, filename);

      // const out = fs.createWriteStream(imagePath);
      // const stream = canvas2.createPNGStream();
      // stream.pipe(out);

      // await new Promise((resolve, reject) => {
      //   out.on('finish', resolve);
      //   out.on('error', reject);
      // });

      // console.log(`Image saved: ${imagePath}`);

      // Upload to S3
      // const uploadResult = await uploadToS3(imagePath, filename);

      const buffer = canvas2.toBuffer('image/png');
      const uploadResult = await uploadToS3Buffer(filename, buffer);

      if (uploadResult) {
        await updateQuote(newQuote.quoteId, {
          image_url: uploadResult.Location,
        });
        quotesReadyForBlog.push({
          id: newQuote.quoteId,
          title: text,
          author: authorFullName,
          imageUrl: uploadResult.Location,
        });
      }

      // Skip if quote exists
      if (newQuote.existing) {
        console.log('Duplicate quote skipped:', text);
        continue;
      }
      console.log('Inserted quote:', newQuote);
    }

    if (quotesReadyForBlog.length > 0) {
      let imagesContent = ''; // also reset here!
      for (const item of quotesReadyForBlog) {
        let quoteInBlog;
        if (item.author !== 'Unknown') {
          quoteInBlog = `"${item.title}" - ${item.author}`;
        } else {
          quoteInBlog = `"${item.title}"`;
        }
        console.log(quoteInBlog);

        imagesContent += `
        <div>
          [![${quoteInBlog}](${item.imageUrl})](../quotes/${item.id})<FavoritesBar quoteId={${item.id}} /><p>${quoteInBlog}</p>
        </div>`;
      }

      const postContent = `<div class="images-blog-container">${imagesContent}</div>`;
      // const postContent = turndownService.turndown(postContentHTML);
      const blogTitle = capitalize(query);
      console.log('Markdown output:', postContent);

      const postData = {
        title: blogTitle,
        content: postContent,
        status: 'published',
        user_id: '1',
      };

      createPost(postData);
    }
  }
};

createQuotes().catch(console.error);
