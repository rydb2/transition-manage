const Router = require('koa-router');

const exc = require('../exc');
const vld = require('../middlewares/vld');
const responseJson = require('../middlewares/responseType').responseJson;
const db = require('../models');

const project = new Router();

async function getProjects(ctx) {
  const args = ctx.args;
  return await db.Project.getAll();
}

project.get(
  '/projects',
  getProjects
);

async function createProject(ctx) {
  const args = ctx.args;
  await db.Project.create(...args);
  return ctx.status = 201;
}

project.post(
  '/projects',
  vld({
    name: {type: 'string', required: true},
    desc: {type: 'string'}
  }),
);

async function getProjectByName(ctx) {
  const args = ctx.args;
  return await db.Project.getByName(ctx.name);
}

project.get(
  '/projects/:name',
  vld({
    name: {type: 'string', required: true}
  }),
  responseJson(),
  getProjectById
);

async function updateProject(ctx) {
  const project = await db.Project.getByName(
    ctx.name,
    new exc.CommonError(exc.Code.PROJECT_NOT_EXIST)
  );
  return await project.update({
    desc: ctx.desc
  });
}

project.put(
  '/projects/:name',
  vld({
    name: {type: 'string', required: true},
    desc: {type: 'string'}
  }),
  responseJson(),
  updateProject
);

async function deleteProject(ctx) {
  const project = await db.Project.getByName(
    ctx.name,
    new exc.CommonError(exc.Code.PROJECT_NOT_EXIST)
  );
  return await project.delete();
}

project.delete(
  '/projects/:name',
  vld({
    name: {type: 'string', required: true}
  }),
  deleteProject
);
