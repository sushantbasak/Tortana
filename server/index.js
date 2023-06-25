const express = require('express');
const api = require('./api');
const appSettings = require('./config');
const port = appSettings.port || 3000;

const {getAudioTranscription} = require('./api/service/speechToText.service');
const {getChatCompletion} = require('./api/service/chatCompletion.service');
const {getAudioFromText} = require('./api/service/textToSpeech.service');

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

    // const prompt = [];

    // let val = await getAudioTranscription({fileName: 'sample.wav'});

    // prompt.push({'role': 'user', 'content': val.result});

    // const {result: generateChat} = await getChatCompletion(prompt);

    // prompt.push(generateChat);

    // const text = generateChat.content;

    // val = await getAudioFromText({text, fileName: 'hello.mp3'});

    // console.log(val);

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
