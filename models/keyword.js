const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const STATUS = require('../constants').STATUS;

// collection definition
let schema = mongoose.Schema({
  projectId: types.ObjectId,
  key: String,
  content: String,
  remark: {type: String, default: ''},
  status: {type: Number},

  ctime: {type: Date, default: Date.now},
  utime: Date,
  version: {type: Number, default: 1}
});


//indexes, every query needs index
schema.index({projectId: 1, status: 1});
schema.index({projectId: 1, key: 1, status: 1});

//static methods, call with Activity

/**
 * update project keyword, create new when key not exists
 * @param   {ObjectId}    projectId
 * @param   {Object}      doc
 * @param   {String}      doc.key
 * @param   {String}      doc.content
 * @param   {String}      doc.remark
 * @returns {Promise}
 */
schema.statics.upsert = function(projectId, {key, content, remark}) {
  return this.findOneAndUpdate(
    { projectId, key },
    { key, content, remark, utime: Date.now()},
    { upsert: true, new: true }
  ).exec();
};

/**
 * get keyword by project id
 * @param   {ObjectId}    projectId
 * @returns {Promise}
 */
schema.statics.getProjectKeywords = function(projectId) {
  return this.find({projectId}).exec();
};

/**
 * delete project keywords, set status DELETED
 * @param     {ObjectId}   projectId
 * @returns   {Promise}
 */
schema.statics.deleteProjectKeywords = function(projectId) {
  return this.updateMany({projectId}, {status: STATUS.DELETED}).exec();
};

const Keyword = mongoose.model('keywords`', schema);

module.exports = Keyword;
