import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from './resolvers'
import { typeDefs  } from './typeDefs'
import { extractToken, getUserByToken } from './middleware/auth-helpers'
const mongoose = require('mongoose')

try {
   mongoose.connect(
       'mongodb+srv://devuser:1111@cluster0.duiue.mongodb.net/haozi', 
       { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
    err => console.log(err);
    }
    mongoose.connection.once('open', function() {
    console.log('mongoose ok')
});

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: req => {
        const authToken = extractToken(req)
        if(authToken){
            const user = getUserByToken(authToken)
        return { user }
        }
    }
});

server.start( () => {
    console.log('graphql-yoga running on http://localhost:4000/')
})


