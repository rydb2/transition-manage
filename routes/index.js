const Router = require('koa-router');

const projectRouter = require('./project');

const router = new Router();

router.use('/', projectRouter.routes(), projectRouter.allowedMethods());

module.exports = router;
