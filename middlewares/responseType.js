/*
 * use this middleware if u want return json data
 */
module.exports.responseJson = function() {
  return async function (ctx, next) {
    let result = await next();
    ctx.response.type = 'json';
    ctx.body = result;
  };
};

/*
 * use this middleware if u want render page with templates
 */
module.exports.template = function(tpl_name) {
  return async function (ctx, next) {
    let result = await next();
    ctx.render(tpl_name, result, true);
  };
};


