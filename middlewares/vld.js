const ObjectId = require('mongodb').ObjectID;
const exc = require("../exc");
const logger = require('../logger');

/**
 * check all the params in body, querystring and url, then inject it into args
 * @middleware
 * @params {key: {type: xxx, required: true|false, min: xxx, max: xxx}
 * @return
 */
module.exports = function(params_vld){
  let vld_types = {
    int: function(raw){
      let payload = parseInt(raw);
      if (!isNaN(payload)) {
        return payload;
      } else {
        throw new Error();
      }
    },
    number: function(raw){
      let payload = +raw;
      if (!isNaN(payload)) {
        return payload;
      } else {
        throw new Error();
      }
    },
    string: function(raw){
      return raw;
    },
    array: function(raw){
      if (!(raw instanceof Array)) {
        throw new Error();
      } else {
        return raw;
      }
    },
    oid: function(raw){
      return ObjectId.ObjectID(raw);
    },
    json: function(raw){
      return raw;
    },
    date: function(raw){
      return new Date(raw);
    },
    bool: function(raw){
      return ['true', 1, true].indexOf(raw) >= 0;
    }
  };

  return async function(ctx, next){
    const getValue = (key) => {
      if(ctx.params && ctx.params[key]) return ctx.params[key];
      if(ctx.request.query && ctx.request.query[key]) return ctx.request.query[key];
      if(ctx.request.body && ctx.request.body[key]) return ctx.request.body[key];
      return null;
    };
    ctx.args = {};
    Object.keys(params_vld).forEach((key) => {
      //check
      const ele = params_vld[key];
      let val = getValue(key);

      if (ele.required && !val) {
        throw new exc.ParamsNotExisted(key);
      }

      if (!val) {
        return;
      }

      //check type
      try {
        ele.type = ele.type || 'string';
        ctx.args[key] = vld_types[ele.type](val);
      } catch (e) {
        logger.error(e);
        throw new exc.TypeError(key);
      }

      //check max and min
      if ((ele.max && val > ele.max) || (ele.min && val < ele.min)) {
        throw new exc.RangeError(key);
      }
    });
    await next();
  };
};