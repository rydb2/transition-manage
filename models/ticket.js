const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

// collection definition
let schema = mongoose.Schema({
  projectId: types.ObjectId,
  userId: types.ObjectId,
  /*
    db.Keyword._id
   */
  keywords: [types.ObjectId]
});

schema.index({projectId: 1, userId: 1});

const Ticket = mongoose.model('users', schema);

//indexes, every query needs index
schema.index({});

//static methods, call with Activity

module.exports = Ticket;
