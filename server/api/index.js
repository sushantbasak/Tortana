const router = require('express').Router();

router.use('/health', async (req, res) => {
  res.status(200).send({
    status: 'Success',
    msg: 'API UP',
  });
});

router.use('/audio', require('./controller/audio.controller'));

module.exports = router;
