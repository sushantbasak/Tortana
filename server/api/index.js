const router = require('express').Router();

router.use('/health', async (req, res) => {
  res.status(200).send({
    status: 'Success',
    msg: 'API UP',
  });
});

module.exports = router;
