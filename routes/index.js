const Router = require('koa-router');

const projectsRouter = require('./projects');
const keywordsRouter = require('./keywords');

const router = new Router();

router.use('/', projectsRouter.routes(), projectsRouter.allowedMethods());
router.use('/', keywordsRouter.routes(), keywordsRouter.allowedMethods());

module.exports = router;
