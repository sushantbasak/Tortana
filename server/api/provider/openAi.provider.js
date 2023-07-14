const axios = require('axios');
const {APIURL} = require('../../constants');
const appSettings = require('../../config');
const apiKey = process.env.OPENAI_API_KEY || appSettings.apiKey.openAI;
const {Readable} = require('stream');

const whispherAPIProvider = async (audioBuffer) => {
  try {
    const url = APIURL.openAI.whispher;

    const audioReadStream = Readable.from(audioBuffer);
    audioReadStream.path = `filename.webm`;

    const resp = await axios.post(
      url,
      {
        'file': audioReadStream,
        'model': 'whisper-1',
        'language': 'en',
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {status: 'SUCCESS', result: resp.data.text};
  } catch (ex) {
    console.log(ex.message);

    return {status: 'ERROR', result: null};
  }
};

const chatGPTProvider = async (prompt) => {
  try {
    const url = APIURL.openAI.chatGPT;

    console.log(prompt);

    const resp = await axios.post(
      url,
      {
        'model': 'gpt-3.5-turbo',
        'messages': prompt,
        'max_tokens': 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return {status: 'SUCCESS', result: resp.data.choices[0].message};
  } catch (ex) {
    console.log(ex.message);

    return {status: 'ERROR', result: null};
  }
};

module.exports = {
  whispherAPIProvider,
  chatGPTProvider,
};
