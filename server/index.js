const express = require('express');
const api = require('./api');
const appSettings = require('./config');
const port = 6222 || appSettings.port;
const cors = require('cors');

const init = async () => {
  try {
    const app = express();

    app.use(cors());
    app.use(express.static('./'));

    const jsonParser = express.json();
    app.use(jsonParser);

    app.use('/api', api);

    app.get('/', (req, res) => {
      res.status(200).send({
        status: 'SUCCESS',
        msg: 'Server is running',
      });
    });

    app.get('/health', (req, res) => {
      res.status(200).send({status: 'SUCCESS', msg: 'UP'});
    });

    app.get('*', function (req, res) {
      res.status(404).send({
        status: 'ERROR',
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
