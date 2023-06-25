require('dotenv').config();

const config = {
  development: {
    port: process.env.PORT,
    apiKey: {
      openAI: process.env.OPENAI_API_KEY,
    },
  },
};

const appSettings = { ...config[process.env.NODE_ENV || 'development'] };

module.exports = appSettings;
