const Router = require('koa-router');

const projectRouter = require('./project');

const router = new Router();

router.use('/projects', projectRouter.routes(), projectRouter.allowedMethods());

module.exports = router;
