require('dotenv').config();

const Dalle = require('dalle-generate-and-download');
const {getPrompts} = require('./prompts');
const {
  createDirectoryIfNotExists,
  validateCronValues,
  getFilesList,
  getRandomArrayEl,
  moveFile,
  getRandomInt
} = require('./utils');
const envs = process.env;
const cronJobsTime = envs.POSTING_SCHEDULE.split(';');
const cron = require('node-cron');
const moment = require('moment');
const {tweetTextWithImage} = require('./twitter');

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const imgSize = 'm';
const minImgPerRequest = envs.MIN_IMAGES_PER_REQUEST;
const maxImgPerRequest = envs.MAX_IMAGES_PER_REQUEST;

console.log(`${now} App: started`);

validateCronValues(cronJobsTime);
createDirectoryIfNotExists(envs.DOWNLOAD_FOLDER);
createDirectoryIfNotExists(envs.POSTED_FOLDER);

const execute = async (dalleInstance) => {
  await dalleInstance.run({size: imgSize, n: getRandomInt(minImgPerRequest, maxImgPerRequest)});
}

(async () => {
  cronJobsTime.forEach(time => {
    console.log(`App: cron job planned for the schedule "${time}"`);
    cron.schedule(time, async () => {
      const now = moment().format(timeFormat);
      console.log(`${now} App: cron job started for the schedule "${time}"`);

      const dalle = new Dalle({
        apiKey: envs.OPENAI_API_KEY,
        prompts: getPrompts(),
        folder: envs.DOWNLOAD_FOLDER
      });
      await execute(dalle);

      const files = await getFilesList(envs.DOWNLOAD_FOLDER);
      const fileName = getRandomArrayEl(files);
      const filePath = `${envs.DOWNLOAD_FOLDER}/${fileName}`;
      const newFilePath = `${envs.POSTED_FOLDER}/${fileName}`;
      await tweetTextWithImage(envs.POST_TEXT, filePath);
      console.log(`App: file ${filePath} posted`);
      await moveFile(filePath, newFilePath);

      console.log(`${now} App: cron job finished for the schedule "${time}"`);
    });
  })
})();
