const {whispherAPIProvider} = require('../provider/openAi.provider');

const getAudioTranscription = (buffer) => {
  return whispherAPIProvider(buffer);
};

module.exports = {getAudioTranscription};
