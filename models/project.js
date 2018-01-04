const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const exc = require('../exc');
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
  utime: {type: Date, default: Date.now},
  version: {type: Number, default: 1}
});


//indexes, every query needs index
schema.index({name: 1, status: 1});
schema.index({status: 1});

//static methods, call with Activity

/** * upsert project
 * @param   {Object}   doc
 * @prop    {String}   doc.name
 * @prop    {String}   doc.content
 * @prop    {String}   doc.remark
 * @returns {Promise.<Project>}
 */
schema.statics.upsert = function({name, desc}) {
  return this.findOneAndUpdate(
    { name, status: STATUS.NORMAL },
    { desc, utime: Date.now()},
    { upsert: true, new: true }
  );
};

/**
 * create new project
 * @param   {String}    name
 * @param   {String}    desc
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
    Keyword.deleteProjectKeywords(this._id),
    this.deleteOne({_id: this._id}, {status: STATUS.DELETED})
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
 * @prop    {Error}     opts.exception - when not found throw error
 * @returns {Project}
 */
schema.statics.getByName = async function(name, opts = {exception: null}) {
  const project = await this.findOne({name: name, status: STATUS.NORMAL});
  if (!project && opts.exception) {
    throw exception;
  }
  return project;
};

const Project = mongoose.model('projects', schema);

module.exports = Project;
