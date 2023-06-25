const axios = require('axios');
const fs = require('fs');

const {APIURL} = require('../../constants');
const appSettings = require('../../config');
const apiKey = appSettings.apiKey.openAI;

const whispherAPIProvider = async ({fileName}) => {
  try {
    const path = process.cwd() + '/' + fileName;
    const fileStream = fs.createReadStream(path);
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

    return {status: 'Success', result: resp.data.text};
  } catch (ex) {
    console.log(ex);

    return {status: 'Error', result: null};
  }
};

const chatGPTProvider = async () => {};

module.exports = {
  whispherAPIProvider,
  chatGPTProvider,
};
