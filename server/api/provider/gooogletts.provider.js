const googleTTS = require('google-tts-api');

const textToSpeech = async (text) => {
  try {
    // get audio URL
    const url = await googleTTS.getAllAudioUrls(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    return {status: 'SUCCESS', result: url};
  } catch (ex) {
    console.log(ex.message);

    return {status: 'ERROR', result: null};
  }
};

module.exports = {textToSpeech};
