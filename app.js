"use strict";

const Koa = require('koa');
const exc = require('./exc');
const logger = require('./logger');

/*
  ;; middlewares
  logger
  error_catch
  router
  static_file
  body parser
  params_validate
  // template (pug)
  returnType (custom middleware)
*/

const app = new Koa();

app.use(async function(ctx, next) {
  if (process.env.NODE_ENV === 'dev') {
    logger.info(ctx.request.url);
  }
  next();
});

/* catch error */
app.use(async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    logger.error(err);
    if (err instanceof exc.BaseError) {
      ctx.status = 400;
      ctx.body = {
        code: err.code,
        message: err.message
      };
    } else {
      ctx.status = err.status || 500;
      ctx.body = 'server error';
    }
  }
});

/* combine routes with koa-router */
const router = require('./routes');
app.use(router.routes());

/* set static path use koa-send */
const send = require('koa-send');
app.use(async function (ctx) {
  await send(ctx, ctx.path, {root: __dirname + '/public'});
});

/* use body parser */
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

/* pug template engine */
// var Pug = require('koa-pug');
// const pug = new Pug({
//     viewPath: './views',
//     debug: false,
//     pretty: false,
//     compileDebug: false,
//     locals: {},
//     basedir: __dirname + '/views',
//     app: app
// });

/* start listen */
const port = process.env.NODE_PORT || 3000;
app.listen(port, function (err) {
  if (!err) console.log('愿世间永无Bug  ( ゜- ゜)つロ');
});

