const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const exc = require('../exc');
const STATUS = require('../constants').STATUS;
const Keyword = require('./keyword');

// collection definition
let schema = mongoose.Schema({
  name: String,
  desc: String,
  defaultLanguage: String,

  languages: [String],
  status: {type: Number, default: STATUS.NORMAL},

  ctime: {type: Date, default: Date.now},
  utime: {type: Date, default: Date.now},
  version: {type: Number, default: 1}
});


//indexes, every query needs index
schema.index({_id: 1, status: 1});

//static methods, call with Activity

/** * upsert project
 * @param   {ObjectId} id
 * @param   {Object}   doc
 * @param   {String}   doc.name
 * @param   {String}   doc.content
 * @param   {String}   doc.remark
 * @returns {Promise.<Project>}
 */
schema.statics.upsert = function(id, {name, desc, languages}) {
  if (languages) {
    languages = languages.map(each => {
      return each.trim().substring(0, 20);
    });
  }
  return this.findOneAndUpdate(
    { _id: id, status: STATUS.NORMAL},
    { name, desc, languages, utime: Date.now()},
    { upsert: true, new: true }
  );
};

/**
 * create new project
 * @param   {String}    name
 * @param   {String}    desc
 * @param   {String}    defaultLanguage
 * @returns {Project}
 */
schema.statics.create = async function({name, desc, defaultLanguage}) {
  const project = new Project({
    name,
    desc,
    defaultLanguage,
    languages: [defaultLanguage]
  });
  await project.save();
  return project;
};

/**
 * delete project and project's keywords
 * @param {ObjectId} id
 * @returns {Promise}
 */
schema.statics.delete = function(id) {
  return Promise.all([
    Keyword.deleteProjectKeywords(id),
    this.update({id}, {status: STATUS.DELETED})
  ]);
};

/**
 * get all projects status is normal
 * @returns {Promise.<Array.<Project>>}
 */
schema.statics.getAll = function() {
  return this.find({status: 1});
};

/**
 * get project by _id
 * @param   {ObjectId}  id
 * @param   {Object}    opts
 * @param   {Error}     opts.exception - when not found throw error
 * @returns {Project}
 */
schema.statics.getById = async function(id, opts = {exception: null}) {
  const project = await this.findOne({_id: id, status: STATUS.NORMAL});
  if (!project && opts.exception) {
    throw exception;
  }
  return project;
}

const Project = mongoose.model('projects', schema);

module.exports = Project;
