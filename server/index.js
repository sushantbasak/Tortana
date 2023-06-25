const express = require('express');
const api = require('./api');
const appSettings = require('./config');
const port = appSettings.port || 3000;

const {getAudioTranscription} = require('./api/service/speechToText.service');

const init = async () => {
  try {
    const app = express();

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

    const val = await getAudioTranscription({fileName: 'sample.wav'});

    console.log(val);

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
