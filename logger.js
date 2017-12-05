let winston = require('winston');
let settings = require('./settings');

winston.level = settings.LOG_LEVEL;
winston.exitOnError = false;

if(process.env.NODE_ENV === 'production'){
    winston.configure({
        transports: [
            new (winston.transports.File)({filename: process.cwd() + '/var/pap.log'})
        ]
    });
}

module.exports = winston;
