const {chatGPTProvider} = require('../provider/openAi.provider');

const getChatCompletion = (prompt) => {
  console.log(prompt);
  return chatGPTProvider(prompt);
};

module.exports = {getChatCompletion};
