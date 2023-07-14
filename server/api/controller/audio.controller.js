const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');

const path = process.cwd();

const {getAudioTranscription} = require('../service/speechToText.service');
const {getChatCompletion} = require('../service/chatCompletion.service');
const {getAudioFromText} = require('../service/textToSpeech.service');

const {whispherAPIProvider} = require('../provider/openAi.provider');

const Storage = multer.memoryStorage();

const upload = multer({
  storage: Storage,
});

const createAudio = async (req, res) => {
  try {
    const prompt = [];

    const audioBuffer = Buffer.from(req.file.buffer);

    let resp = await getAudioTranscription(audioBuffer);

    if (resp.status === 'ERROR')
      throw new Error('Speech to Transcript API (Whispher)  is not working');

    console.log(resp, 'Whisper Complete');

    prompt.push({'role': 'user', 'content': resp.result});

    console.log(prompt, 'Intitial Prompt Value');

    resp = await getChatCompletion(prompt);

    if (resp.status === 'ERROR')
      throw new Error(
        'Response Generator LLM Model API (Chat GPT) is not working'
      );

    const generateChat = resp.result;
    console.log(generateChat, 'Generated Prompt');

    prompt.push(generateChat);

    console.log(prompt);

    const text = generateChat.content;

    const outputFile = path + '/data/result/' + req.file.filename;

    console.log(text, 'Text De rhe hai');

    resp = await getAudioFromText({text, fileName: outputFile});

    if (resp.status === 'ERROR')
      throw new Error('Speech from Text API (GTTS) is not working');

    console.log(resp, 'File Save ho gaya');

    res.status(200).send('ok');
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Internal Server Error');
  }
};

const getAudio = (req, res) => {
  const id = req.params.id;

  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires Range header');
  }

  try {
    // console.log('Load File');

    const audioPath = path + '/data/result/' + id;
    const audioSize = fs.statSync(audioPath).size;
    // console.log("size of audio is:", audioSize);
    const CHUNK_SIZE = 10 ** 6; //1 MB
    // console.log(range);
    const start = Number(range.replace(/\D/g, ''));
    // const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
    const end = Math.min(audioSize - 1, 9007199254740000);

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
  } catch (ex) {
    console.log(ex.message);
    res.status(400).send('Bad Request');
  }
};

router.post('/', upload.single('audio_data'), createAudio);
router.get('/:id', getAudio);

module.exports = router;
