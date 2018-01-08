const { makeExecutableSchema } = require('graphql-tools');
const { graphqlKoa } = require('apollo-server-koa');
const { GraphQLDate } = require('graphql-iso-date');
// const {
//   graphql,
//   GraphQLObjectType,
//   GraphQLSchema,
//   GraphQLString,
//   GraphQLInt,
//   GraphQLList
// } = require('graphql');
const Router = require('koa-router');

const exc = require('../exc');
const vld = require('../middlewares/vld');
const { responseJson } = require('../middlewares/responseType');
const db = require('../models');

const project = new Router({
  prefix: 'projects'
});

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
    project: async (root, {name}) => {
      return await db.Project.getByName(name);
    },
    allProjects: async () => {
      return await db.Project.getAll();
    }
  },
  Mutation: {
    createProject: async (root, {name, desc}) => {
      return await db.Project.create({name, desc});
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

/* use graphql js example. personally, I think it's not elegant */
/*
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    desc: { type: GraphQLString },
    languages: { type: GraphQLList(GraphQLString) },
    ctime: { type: GraphQLDate },
    utime: { type: GraphQLDate },
    version: { type: GraphQLInt }
  }
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    project: {
      type: ProjectType,
      args: {
        name: {
          type: GraphQLString
        }
      },
      resolve: async function(args, {name}, info) {
        return await db.Project.getByName(name);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: QueryType
});
*/

project.get('/', graphqlKoa({ schema }));
project.post('/', graphqlKoa({ schema }));

if (process.env.NODE_ENV !== 'production') {
  const graphiqlKoa = require('apollo-server-koa').graphiqlKoa ;
  project.get('/graphiql', graphiqlKoa({
    endpointURL: '/projects' // a POST endpoint that GraphiQL will make the actual requests to
  }));
}

module.exports = project;

