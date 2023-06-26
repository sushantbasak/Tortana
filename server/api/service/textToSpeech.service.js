const gTTS = require('gtts');

const getAudioFromText = async ({text, fileName}) => {
  try {
    console.log(text);
    const gtts = new gTTS(text, 'en');

    await gtts.save(fileName);

    return {status: 'Success', file: fileName};
  } catch (ex) {
    console.log(ex);

    return {status: 'Error', file: null};
  }
};

module.exports = {getAudioFromText};
