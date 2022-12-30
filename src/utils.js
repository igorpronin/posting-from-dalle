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

module.exports = {createDirectoryIfNotExists, validateCronValues}
