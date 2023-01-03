const fs = require('fs');
const cron = require('node-cron');

const createDirectoryIfNotExists = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

const validateCronValues = (values) =>{
  values.forEach(item => {
    const isValid = cron.validate(item);
    if (!isValid) {
      throw new Error(`Cron time value "${item}" is not valid, examples of valid values see here: https://www.npmjs.com/package/node-cron`);
    }
  });
}

const getFilesList = (folder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) {
        console.log(err);
        reject();
      }
      files = files.filter((file) => {
        const filePath = `${folder}/${file}`;
        return fs.statSync(filePath).isFile();
      });
      return resolve(files);
    });
  })
}

const getRandomArrayEl = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const moveFile = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        // If an error occurred, log it to the console
        console.log(error);
        reject();
      } else {
        // Otherwise, log a success message
        console.log(`App: file moved successfully to ${newPath}`);
        resolve();
      }
    });
  })
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  createDirectoryIfNotExists,
  validateCronValues,
  getFilesList,
  getRandomArrayEl,
  moveFile,
  getRandomInt
}
