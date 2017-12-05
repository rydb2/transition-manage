const exc = require("../exc");
/*
  登录验证
  auth({
      loginRequired: Boolean,   是否必须登录
  })
 */
module.exports = function(opts={loginRequired: true}) {
  const {loginRequired} = opts;
  return async function auth(ctx, next) {
    const user = ''; // solve cookie and find from db
    if (!user && loginRequired) {
      throw(new exc.PermissionError(exc.Code.NOT_LOGIN));
    }
    ctx.currentUser = user;
    await next();
  };
};