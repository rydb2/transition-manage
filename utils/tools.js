
const ObjectId = require('mongodb').ObjectId;
const base64url = require('base64url');
const exc = require('../exc');

// Date.prototype.toJSON = function() {
//     return this.getTime();
// };

// ObjectId.prototype.toJSON = function() {
//     return str2oid(this);
// };

function oid2str(oid){
    try {
        return base64url.encode(new Buffer(oid.toHexString(), 'hex'));
    } catch (e) {
        throw exc.TypeError(exc.Code.OBJECT_ID_INVALID);
    }
};

function str2oid(str){
    try {
        var s = base64url.decode(str, 'hex');
        return ObjectId(s);
    } catch (e) {
        throw exc.TypeError(exc.Code.OBJECT_ID_INVALID);
    }
};


function encode_json(obj) {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        throw exc.TypeError(exc.Code.ENCODE_JSON_FAIL);
    }
};

function decode_json(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        throw exc.TypeError(exc.Code.JSON_INVALID);
    }
}

module.exports = {
    oid2str,
    str2oid,
    encode_json
};
