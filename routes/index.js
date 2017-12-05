const Router = require('koa-router');

const htmlRouter = require('./html.js');
const apiRouter = require('./api.js');

const router = new Router();

router.use('/pages', htmlRouter.routes(), htmlRouter.allowedMethods());
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

module.exports = router;
