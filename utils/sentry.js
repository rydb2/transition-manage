
var raven = require('raven');

var client = new raven.Client('');


module.exports.msg = (msg) => client.captureMessage(msg);
module.exports.error = (err) => client.captureError(err);

