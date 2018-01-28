"use strict";

const Koa = require('koa');
const exc = require('./exc');
const logger = require('./logger');
const settings = require('./settings');

/*
  ;; middlewares
  logger
  error_catch
  cors
  body parser
  router
  static_file
  params_validate
  // template (pug)
  returnType (custom middleware)
*/

const app = new Koa();

app.use(async function(ctx, next) {
  if (process.env.NODE_ENV === 'dev') {
    logger.info(ctx.request.url);
  }
  await next();
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

const cors = require('@koa/cors');
if (process.env.NODE_ENV !== 'production') {
  app.use(cors(settings.CORS));
} else {
  app.use(cors());
}

/* use body parser */
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

/* combine routes with koa-router */
const router = require('./routes');
app.use(router.routes());

/* set static path use koa-send */
const send = require('koa-send');
app.use(async function (ctx) {
  if (ctx.path.startsWith('/public')) {
    await send(ctx, ctx.path, {root: __dirname + '/public'});
  }
});


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
const port = process.env.NODE_PORT || 3200;
app.listen(port, function (err) {
  if (!err) console.log('愿世间永无Bug  ( ゜- ゜)つロ');
});

