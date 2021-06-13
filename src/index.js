import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from './resolvers'
import { typeDefs  } from './typeDefs'
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const isAuth = require('./middleware/is-auth.js')

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
        const { user } = req.request.headers || '';
        console.log(user);
    }
});

server.express.use(isAuth);
server.start( () => {
    console.log('graphql-yoga running on http://localhost:4000/')
})

/* mutation{
    createUser(email:"mail@domain.com", password:"1234"){
      email
      password
        }
    }

{
    login(email:"mail@domain.com", password:"1234"){
        userId
        token
        tokenExpiration
    }
} 

{
    ticket{
        date
    }
}*/
/* index */