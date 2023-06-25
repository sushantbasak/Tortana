const {whispherAPIProvider} = require('../provider/openAi.provider');

const getAudioTranscription = (file) => {
  return whispherAPIProvider(file);
};

module.exports = {getAudioTranscription};
