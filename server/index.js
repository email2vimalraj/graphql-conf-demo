const { GraphQLServer } = require('graphql-yoga')

const { prisma } = require('./generated/prisma-client')
const resolvers = require('./resolver')

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  }
})

server.start(() => console.log(`Server running on http://localhost:4000`))
