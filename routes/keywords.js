const {ObjectId} = require('mongoose').Types;
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlKoa } = require('apollo-server-koa');
const { GraphQLDate } = require('graphql-iso-date');
const Router = require('koa-router');

const exc = require('../exc');
const db = require('../models');

const keywords = new Router({
  prefix: 'keywords'
});

const typeDefs = `
  scalar GraphQLDate
  
  type Query {
    keywords(projectId: String): [Keyword]
  }
  
  type Keyword {
    _id: String,
    projectId: String,
    key: String,
    content: String,
    remark: String,
    version: Int,
    utime: GraphQLDate,
    ctime: GraphQLDate
  }
  
  type Mutation {
    newKeyword(projectId: String, key: String, content: String, remark: String): Keyword
  }
  
  schema {
    query: Query
    mutation: Mutation
  }
`;

const resolvers = {
  Query: {
    keywords: async (root, {projectId}) => {
      return await db.Keyword.getProjectKeywords(ObjectId(projectId));
    }
  },
  Mutation: {
    newKeyword: async (root, {projectId, key, content, remark}) => {
      return await db.Keyword.create({
        projectId: ObjectId(projectId),
        key,
        content,
        remark
      })
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

keywords.get('/', graphqlKoa({ schema }));
keywords.post('/', graphqlKoa({ schema }));

if (process.env.NODE_ENV !== 'production') {
  const graphiqlKoa = require('apollo-server-koa').graphiqlKoa ;
  keywords.get('/graphiql', graphiqlKoa({
    endpointURL: '/keywords' // a POST endpoint that GraphiQL will make the actual requests to
  }));
}

module.exports = keywords;

