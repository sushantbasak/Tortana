const express = require('express');
const api = require('./api');
const appSettings = require('./config');
const port = appSettings.port || 3000;
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const {getAudioTranscription} = require('./api/service/speechToText.service');
const {getChatCompletion} = require('./api/service/chatCompletion.service');
const {getAudioFromText} = require('./api/service/textToSpeech.service');

const init = async () => {
  try {
    const path = process.cwd();
    const app = express();

    app.use(cors());

    app.use(express.static('./'));

    const jsonParser = express.json();
    app.use(jsonParser);

    app.use('/api', api);

    app.get('/', (req, res) => {
      res.status(200).send({
        status: 'Success',
        msg: 'Server is running',
      });
    });

    app.get('/health', (req, res) => {
      res.status(200).send({status: 'Success', msg: 'UP'});
    });

    app.get('*', function (req, res) {
      res.status(404).send({
        status: 'Error',
        msg: 'Requested Page does not exist',
      });
    });

    return app;
  } catch (ex) {
    throw new Error(ex);
  }
};

init()
  .then((app) => app.listen(port))
  .then(() => {
    console.log('Server started on port:', port);
  })
  .catch((err) => {
    console.error(err);
  });
