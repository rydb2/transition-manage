const mongoose = require('mongoose');
const exc = require('../exc');
const types = mongoose.Schema.Types;

const STATUS = require('../constants').STATUS;

// collection definition
let schema = mongoose.Schema({
  projectId: types.ObjectId,
  language: String,                                   // project language
  key: String,
  content: String,                                    // keywords value
  remark: {type: String, default: ''},                // keywords desc
  status: {type: Number, default: STATUS.NORMAL},
  version: {type: Number, default: 1},

  ctime: {type: Date, default: Date.now},
  utime: {type: Date, default: Date.now},
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
schema.statics.upsert = function(id, {key, content, remark}) {
  return this.findOneAndUpdate(
    { _id: id, key, status: STATUS.NORMAL },
    { key, content, remark, utime: Date.now()},
    { upsert: true, new: true }
  ).exec();
};

/**
 * create keyword
 * @param {ObjectId}     projectId
 * @param {String}       key
 * @param {String}       content
 * @param {String}       remark
 * @returns {Keyword}
 */
schema.statics.create = async function({projectId, key, content, remark}) {
  const keyword = await this.findOne({projectId, key, status: STATUS.NORMAL});
  if (keyword) {
    throw new exc.PermissionError(exc.Code.KEYWORD_ALREADY_EXIST);
  }
  const newKeyword = new Keyword({
    projectId,
    key,
    content,
    remark
  });
  await newKeyword.save();
  return newKeyword;
};

/**
 * get keyword by project id
 * @param   {ObjectId}    projectId
 * @returns {Promise}
 */
schema.statics.getProjectKeywords = function(projectId) {
  return this.find({projectId});
};

/**
 * delete project keywords, set status DELETED
 * @param     {ObjectId}   projectId
 * @returns   {Promise}
 */
schema.statics.deleteProjectKeywords = function(projectId) {
  return this.updateMany({projectId}, {status: STATUS.DELETED});
};

const Keyword = mongoose.model('keywords`', schema);

module.exports = Keyword;
