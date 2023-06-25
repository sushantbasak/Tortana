const {chatGPTProvider} = require('../provider/openAi.provider');

const getChatCompletion = (prompt) => {
  return chatGPTProvider(prompt);
};

module.exports = {getChatCompletion};
