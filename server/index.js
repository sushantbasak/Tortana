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

    // storage
    const Storage = multer.diskStorage({
      destination: path + '/data/uploads',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const upload = multer({
      storage: Storage,
    });

    app.get('/audio/:id', function (req, res) {
      const id = req.params.id;

      const range = req.headers.range;
      if (!range) {
        res.status(400).send('Requires Range header');
      }

      const audioPath = path + '/data/result/' + id;
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

    const prompt = [];

    app.post('/audio', upload.single('audio_data'), async (req, res) => {
      try {
        const inputFile = req.file.path;

        // console.log('Req mil gaya');

        let val = await getAudioTranscription({fileName: inputFile});

        // console.log(val, 'Whisper Complete');

        prompt.push({'role': 'user', 'content': val.result});

        // console.log(prompt, 'Intitial Prompt Value');

        const {result: generateChat} = await getChatCompletion(prompt);

        // console.log(generateChat, 'Generated Prompt');

        prompt.push(generateChat);

        const text = generateChat.content;

        const outputFile = path + '/data/result/' + req.file.filename;

        // console.log(text, 'Text De rhe hai');

        val = await getAudioFromText({text, fileName: outputFile});

        // console.log(val);

        res.status(200).send('ok');
      } catch (ex) {
        console.log(ex);
        res.status(500).send('Internal Server Error');
      }
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
