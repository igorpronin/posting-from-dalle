require('dotenv').config();

const Dalle = require('dalle-generate-and-download');
const {getPrompts} = require('./prompts');
const {createDirectoryIfNotExists, validateCronValues} = require('./utils');
const envs = process.env;
const cronJobsTime = envs.POSTING_SCHEDULE.split(';');
const cron = require('node-cron');
const moment = require('moment');

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const now = moment().format(timeFormat);
const imgSize = 'm';

console.log(`${now} App: started`);

validateCronValues(cronJobsTime);
createDirectoryIfNotExists(envs.DOWNLOAD_FOLDER);
createDirectoryIfNotExists(envs.POSTED_FOLDER);

const execute = async (dalleInstance) => {
  const newFiles = await dalleInstance.run({size: imgSize});
  console.log(newFiles);
}

(() => {
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
      console.log(`${now} App: cron job finished for the schedule "${time}"`);
    });
  })
})();

// execute();
