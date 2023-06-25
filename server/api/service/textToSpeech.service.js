const gTTS = require('gtts');

const getAudioFromText = async ({text, fileName}) => {
  try {
    const gtts = new gTTS(text, 'en');

    const file = process.cwd() + '/' + fileName;

    await gtts.save(file);

    return {status: 'Success', file};
  } catch (ex) {
    console.log(ex);

    return {status: 'Error', file: null};
  }
};

module.exports = {getAudioFromText};
