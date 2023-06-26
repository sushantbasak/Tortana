const gTTS = require('gtts');

const getAudioFromText = async ({text, fileName}) => {
  try {
    console.log(text);
    const gtts = new gTTS(text, 'en');

    await gtts.save(fileName);

    return {status: 'SUCCESS', file: fileName};
  } catch (ex) {
    console.log(ex.message);

    return {status: 'ERROR', file: null};
  }
};

module.exports = {getAudioFromText};
