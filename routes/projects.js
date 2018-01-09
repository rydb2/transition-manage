const {ObjectId} = require('mongoose').Types;
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
const db = require('../models');

const projects = new Router({
  prefix: 'projects'
});

const typeDefs = `
  scalar GraphQLDate

  type Query {
    project(id: String): Project
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
    newProject(name: String, desc: String): Project
    updateProject(id:String, name: String, desc: String, languages: [String]): Project
  }

  schema {
    query: Query
    mutation: Mutation
  }

`;

const resolvers = {
  Query: {
    project: async (root, {id}) => {
      return await db.Project.getById(ObjectId(id));
    },
    allProjects: async () => {
      return await db.Project.getAll();
    }
  },
  Mutation: {
    newProject: async (root, {name, desc}) => {
      return await db.Project.create({name, desc});
    },
    updateProject: async (root, {id, name, desc, languages}) => {
      return await db.Project.upsert(ObjectId(id), {name, desc, languages});
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

projects.get('/', graphqlKoa({ schema }));
projects.post('/', graphqlKoa({ schema }));

if (process.env.NODE_ENV !== 'production') {
  const graphiqlKoa = require('apollo-server-koa').graphiqlKoa ;
  projects.get('/graphiql', graphiqlKoa({
    endpointURL: '/projects' // a POST endpoint that GraphiQL will make the actual requests to
  }));
}

module.exports = projects;

