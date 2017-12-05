const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const exc = reuqire('../exc');
const STATUS = require('../constants').STATUS;
const Keyword = require('./keyword');

// collection definition
let schema = mongoose.Schema({
  name: String,
  desc: String,
  /*
    {
      key,  // used to diff different language
      name  // frontend show name
    }
   */
  languages: [{}],
  status: {type: Number, default: STATUS.NORMAL},

  ctime: {type: Date, default: Date.now},
  utime: Date,
  version: {type: Number, default: 1}
});


//indexes, every query needs index
schema.index({name: 1, status: 1});
schema.index({status: 1});

//static methods, call with Activity

/**
 * upsert project
 * @param {Object} doc
 * @param {String} doc.name
 * @param {String} doc.content
 * @param {String} doc.remark
 * @returns {}
 */
schema.statics.upsert = function({name, desc}) {
  return this.findOneAndUpdate(
    { name, status: STATUS.NORMAL },
    { desc, utime: Date.now()},
    { upsert: true, new: true }
  ).exec();
};

/**
 * create new project
 * @param {String} name
 * @param {String} desc
 * @returns {Project}
 */
schema.statics.create = async function({name, desc}) {
  const project = new Project({
    name,
    desc
  });
  const exist = !!await this.getByName(name);
  if (exist) {
    throw new exc.CommonError(exc.Code.PROJECT_ALREADY_EXIST);
  }
  return await project.save();
};

/**
 * delete project and project's keywords
 * @param {ObjectId} id
 * @returns {Promise}
 */
schema.statics.delete = function(id) {
  return Promise.all([
    Keyword.deleteProjectKeywords(this._id),
    this.deleteOne({_id: this._id}, {status: STATUS.DELETED})
  ]);
};

/**
 * get all projects status is normal
 * @returns {Promise}
 */
schema.statics.getAll = function() {
  return this.find({status: 1});
};

/**
 * get project by _id
 * @param {ObjectId} id
 * @param {Object} opts
 * @param {Error} opts.exception - when not found throw error
 * @returns {Project}
 */
schema.statics.getByName = async function(name, {exception}) {
  const project = await this.findOne({name: name, status: STATUS.NORMAL});
  if (!project && exception) {
    throw exception;
  }
  return project;
};

// instance methods
const Project = mongoose.model('projects`', schema);

/**
 * get project keywords
 * @returns {Promise}
 */
Project.methods.getKeywords = function() {
  return Keyword.getProjectKeywords(this._id);
};

/**
 * update project
 * @param {Object} doc
 * @param {String} doc.name
 * @param {String} doc.content
 * @returns {Promise}
 */
Project.methods.update = function({name, desc}) {
  return this.model('projects').update(
    {_id: this._id},
    {desc}
  );
};

/**
 * delete project
 * @returns {Promise}
 */
Project.methods.delete = function() {
  return this.model('projects').deleteOne({_id: this._id});
};

module.exports = Keyword;
