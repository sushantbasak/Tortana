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
    const app = express();

    app.use(cors());

    app.use(express.static('./'));

    const jsonParser = express.json();
    app.use(jsonParser);

    // storage
    const Storage = multer.diskStorage({
      destination: process.cwd() + '/data/uploads',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const upload = multer({
      storage: Storage,
    });

    app.get('/audio/:id', function (req, res) {
      const id = req.params.id;

      if (id == null) console.log('Hello');
      const range = req.headers.range;
      if (!range) {
        res.status(400).send('Requires Range header');
      }
      const path = process.cwd() + '/data/result/' + id;
      const audioPath = path;
      const audioSize = fs.statSync(audioPath).size;
      // console.log("size of audio is:", audioSize);
      const CHUNK_SIZE = 10 ** 6; //1 MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${audioSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'audio/mp3',
      };
      res.writeHead(206, headers);
      const audioStream = fs.createReadStream(audioPath, {start, end});
      audioStream.pipe(res);
    });

    app.post('/audio', upload.single('audio_data'), function (req, res) {
      console.log(req.file);
      res.status(200).send('ok');
    });

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
