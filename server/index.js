const { GraphQLServer, PubSub } = require('graphql-yoga')

const { prisma } = require('./generated/prisma-client')
const resolvers = require('./resolver')

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
    pubsub
  }
})

server.start(() => console.log(`Server running on http://localhost:4000`))
