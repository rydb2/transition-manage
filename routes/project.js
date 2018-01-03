const graphqlTools = require('graphql-tools');
const makeExecutableSchema = graphqlTools.makeExecutableSchema;

const graphqlKoa = require('apollo-server-koa').graphqlKoa ;
const graphiqlKoa = require('apollo-server-koa').graphiqlKoa ;
const GraphQLDate = require('graphql-iso-date').GraphQLDate;

const Router = require('koa-router');

const exc = require('../exc');
const vld = require('../middlewares/vld');
const responseJson = require('../middlewares/responseType').responseJson;
const db = require('../models');

const project = new Router();

const typeDefs = `
  scalar GraphQLDate

  type Query {
    project(name: String): Project
    allProjects: [Project]
  }

  type Project {
    _id: String,
    name: String,
    desc: String,
    languages: [String],
    ctime: GraphQLDate,
    utime: GraphQLDate,
    version: Int
  }

  type Mutation {
    createProject(name: String, desc: String): Project
  }

  schema {
    query: Query
    mutation: Mutation
  }

`;

const resolvers = {
  Query: {
    project: async (name) => {
      return await db.Project.getByName(name);
    },
    allProjects: async () => {
      return await db.Project.getAll();
    }
  },
  Mutation: {
    createProject: async (name, desc) => {
      return await db.Project.create({name, desc});
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

project.get('/', graphqlKoa({ schema }));
project.post('/', graphqlKoa({ schema }));
project.get('/graphiql', graphiqlKoa({
  endpointURL: '/projects' // a POST endpoint that GraphiQL will make the actual requests to
}));

project.get('/test', async function(ctx) {
  ctx.body = 'test';
});

module.exports = project;

