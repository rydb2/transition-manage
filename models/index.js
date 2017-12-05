/**
 * init mongodb and import all the models
 */

const mongoose = require('mongoose');
const settings = require('../settings');

//init mongodb
// mongoose.connect(settings.MONGODB_DSN, {
//   useMongoClient: true,
// });

// import models
const Ticket = require('./ticket');
const Project = require('./project');
const Keyword = require('./keyword');
const Transitioin = require('./transition');

module.exports = {
  Ticket,
  Project,
  Keyword,
  Transitioin
};
