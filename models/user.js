const mongoose = require('mongoose');

// collection definition
let schema = mongoose.Schema({
});

const User = mongoose.model('users', schema);

//indexes, every query needs index
schema.index({});

//static methods, call with Activity

module.exports = User;
