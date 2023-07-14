const {textToSpeech} = require('../provider/gooogletts.provider');

const getAudioFromText = (text) => {
  return textToSpeech(text);
};

module.exports = {getAudioFromText};
