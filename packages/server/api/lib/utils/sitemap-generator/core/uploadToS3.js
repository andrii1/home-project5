const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

module.exports = function uploadToS3(bucket, key, body) {
  return s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: 'application/xml',
    })
    .promise();
};
