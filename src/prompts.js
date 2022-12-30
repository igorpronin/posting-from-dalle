const envs = process.env;

const examplePrompts = [
  'cuttiest cat in the world',
  'cuttiest dog in the world',
];

const getPrompts = () => {
  if (!envs.PROMPTS) {
    return examplePrompts;
  } else {
    return envs.PROMPTS.split(';');
  }
}

module.exports = {getPrompts}
