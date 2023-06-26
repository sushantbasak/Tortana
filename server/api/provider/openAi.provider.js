const axios = require('axios');
const fs = require('fs');

const {APIURL} = require('../../constants');
const appSettings = require('../../config');
const apiKey = appSettings.apiKey.openAI;

const whispherAPIProvider = async ({fileName}) => {
  try {
    const fileStream = fs.createReadStream(fileName);
    const url = APIURL.openAI.whispher;

    const resp = await axios.post(
      url,
      {
        'file': fileStream,
        'model': 'whisper-1',
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
