const codes = {
  INTERNAL_ERROR: [10001, 'internal error'],
  PARAMS_ERROR: [10002, 'params error'],
  PARAMS_NOT_EXISTED: [10003, 'params not exists'],
  RANGE_ERROR: [10004, 'out of range'],
  TYPE_ERROR: [10005, 'type error'],

  PERMISSION_DENIED: [20001, 'permision deined'],
  NOT_LOGIN: [20002, 'login requiredd'],

  INPUT_ERROR: [30001, 'input error'],
  NOT_JSON: [30002, 'not JSON'],
  OBJECT_ID_INVALID: [30003, 'not valid ObjctId'],
  JSON_INVALID: [30003, 'JSON invalid'],

  PROJECT_NOT_EXIST: [40001, 'project not exist'],
  PROJECT_ALREADY_EXIST: [40002, 'project already exist'],

  KEYWORD_ALREADY_EXIST: [50001, 'keyword already exist'],
};

const Code = (function () {
  let r = {};
  Object.keys(codes).forEach((key) => {
    let [code, message] = codes[key];
    r[key] = {
      code,
      message
    };
  });
  return r;
})();

class BaseError extends Error {
  constructor(err) {
    err = typeof err === 'undefined' ? Code.INTERNAL_ERROR : err;
    super(err.message);
    this.code = err.err_code;
  }
}

class CommonError extends BaseError {
}

class PermissionError extends BaseError {
  constructor(err) {
    err = typeof err === 'undefined' ? Code.PERMISSION_DENIED : err;
    super(err);
  }
}

class ParamsError extends BaseError {
  constructor(param_name) {
    super(Object.assign(Code.PARAMS_ERROR, {message: `params error: ${param_name}`}));
  }
}

class ParamsNotExisted extends BaseError {
  constructor(param_name) {
    super(Object.assign(Code.PARAMS_NOT_EXISTED, {message: `params not existed: ${param_name}`}));
  }
}

class RangeError extends BaseError {
  constructor(param_name) {
    super(Object.assign(Code.PARAMS_ERROR, {message: `range error: ${param_name}`}));
  }
}

class AuthError extends BaseError {
}

class InputError extends BaseError {
}

class TypeError extends BaseError {
  constructor(param_name) {
    super(Object.assign(Code.TYPE_ERROR, {message: `type error: ${param_name}`}));
  }
}

class ApiRequestError extends BaseError {
}

module.exports = {
  Code,
  BaseError,
  CommonError,
  PermissionError,
  AuthError,
  InputError,
  ApiRequestError,
  TypeError,
  ParamsError,
  ParamsNotExisted,
  RangeError
};
