"use strict";

const commonConfig = {

};

const config = {
  production: {
    LOG_LEVEL: 'info',
  },
  dev: {
    LOG_LEVEL: 'debug',
    MONGODB_DSN: 'mongodb://127.0.0.1:27017/transition'
  },
};

let env = process.env.NODE_ENV || 'dev';
module.exports = Object.assign(commonConfig, config[env]);
