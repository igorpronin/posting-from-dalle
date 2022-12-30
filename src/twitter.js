const { TwitterApi } = require('twitter-api-v2');

const envs = process.env;

const appKey = envs.TWITTER_APP_KEY;
const appSecret = envs.TWITTER_APP_SECRET;
const accessToken = envs.TWITTER_ACCESS_TOKEN;
const accessSecret = envs.TWITTER_ACCESS_SECRET;

const twitterClient = new TwitterApi({
  appKey,
  appSecret,
  accessToken,
  accessSecret,
});

const tweetText = async (text) => {
  return await twitterClient.v1.tweet(text);
}

const tweetTextWithImage = async (text, path) => {
  const mediaId = await twitterClient.v1.uploadMedia(path);
  return await twitterClient.v1.tweet(text, { media_ids: [mediaId] });
}

module.exports = {tweetText, tweetTextWithImage};
