const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');

const path = process.cwd();

const {getAudioTranscription} = require('../service/speechToText.service');
const {getChatCompletion} = require('../service/chatCompletion.service');
const {getAudioFromText} = require('../service/textToSpeech.service');

const Storage = multer.diskStorage({
  destination: path + '/data/uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
});

const createAudio = async (req, res) => {
  try {
    const prompt = [];

    const inputFile = req.file.path;

    console.log('Req mil gaya');

    let val = await getAudioTranscription({fileName: inputFile});

    console.log(val, 'Whisper Complete');

    prompt.push({'role': 'user', 'content': val.result});

    console.log(prompt, 'Intitial Prompt Value');

    const {result: generateChat} = await getChatCompletion(prompt);

    console.log(generateChat, 'Generated Prompt');

    prompt.push(generateChat);

    console.log(prompt);

    const text = generateChat.content;

    const outputFile = path + '/data/result/' + req.file.filename;

    console.log(text, 'Text De rhe hai');

    val = await getAudioFromText({text, fileName: outputFile});

    console.log(val, 'File Save ho gaya');

    res.status(200).send('ok');
  } catch (ex) {
    console.log(ex);
    res.status(500).send('Internal Server Error');
  }
};

const getAudio = (req, res) => {
  const id = req.params.id;

  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires Range header');
  }

  console.log('Load File');

  const audioPath = path + '/data/result/' + id;
  const audioSize = fs.statSync(audioPath).size;
  // console.log("size of audio is:", audioSize);
  const CHUNK_SIZE = 10 ** 6; //1 MB
  console.log(range);
  const start = Number(range.replace(/\D/g, ''));
  // const end = Math.min(start + CHUNK_SIZE, audioSize - 1);

  const end = audioSize - 1;
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
};

router.post('/', upload.single('audio_data'), createAudio);
router.get('/:id', getAudio);

module.exports = router;
