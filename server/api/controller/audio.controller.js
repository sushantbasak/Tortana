const router = require('express').Router();
const multer = require('multer');

const {getAudioTranscription} = require('../service/speechToText.service');
const {getChatCompletion} = require('../service/chatCompletion.service');
const {getAudioFromText} = require('../service/textToSpeech.service');
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

    const instruction = ' Generate response with less than 100 tokens';

    prompt.push({'role': 'user', 'content': resp.result + instruction});

    // console.log(prompt, 'Intitial Prompt Value');

    resp = await getChatCompletion(prompt);

    if (resp.status === 'ERROR')
      throw new Error(
        'Response Generator LLM Model API (Chat GPT) is not working'
      );

    const generateChat = resp.result;
    // console.log(generateChat, 'Generated Prompt');

    prompt.push(generateChat);

    // console.log(prompt);

    const text = generateChat.content;

    console.log(text, 'Text De rhe hai');

    resp = await getAudioFromText(text);

    console.log(resp);

    res.status(200).send(resp);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Internal Server Error');
  }
};

router.post('/', upload.single('audio_data'), createAudio);

module.exports = router;
