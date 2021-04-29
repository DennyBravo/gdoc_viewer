const { parsed } = require('dotenv').config();
const { NODE_ENV, WEBPACK_DEV_MODE } = process.env;
const PRODUCTION = NODE_ENV === 'production';

const env = {
  PRODUCTION,
  NODE_ENV,
  WEBPACK_DEV_MODE,
  ENV_CONFIG: parsed,
};

module.exports = env;
