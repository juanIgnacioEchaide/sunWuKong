import { GraphQLServer } from 'graphql-yoga'
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const isAuth = require('./middleware/is-auth.js')
import { Product, Ticket, Menu, Promo, User } from './model/models'
 
/* typeDefs */
const typeDefs = `
    type Query {
        product(id: ID): [Product!]!
        menu(id: ID): [Menu]!
        ticket(author: String): [Ticket]!
        promo(id: ID): [Promo]!
    }

    type Mutation {
        createProduct(description: String!, price: Float, expiringDate: String!): Product
        createTicket(date: String, author: String, type: String, data: [ProductInput]): Ticket
        createMenu(name: String, description: String, products: [ProductInput], price: Float): Menu
        createPromo(name: String, description: String, menus: [MenuInput], price: Float): Promo
        createUser(email: String, password: String): User
        login( email: String, password: String): AuthData
    }
  
    type Product {
        id: ID
        description: String
        price: Float
        expiringDate: String
    }

    input ProductInput {
        id: ID!
        description: String!
        price: Float
        expiringDate: String!
    }

    type Menu {
        id: ID
        name: String
        description: String
        products: [Product]
        price: Float
    }

    input MenuInput {
        name: String
        description: String
        products: [ProductInput]
        price: Float
    }

    type Promo {
        id: ID
        name: String
        description: String
        menus: [Menu]
        price: Float
    }

    type Ticket {
        id: ID
        date: String
        author: String
        type: String
        data: [Product]
    }

    type User {
        id: ID,
        email: String, 
        password: String, 
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
`

/* resolvers */
const resolvers = {
    Query: {
        product(parent, args,context, info) {
            if(!args.id){
            return Product.find({});
            }
            return Product.findOne({id: args.id});
        },
        menu(parent, args,context, info) {
            if(!args.id){
                return Menu.find({});
                }
                return Menu.findById(args.id)
        },
        ticket(parent, args,context, info) {
            if(!args.author){
                return Ticket.find({});
            }
             return Ticket.findOne({author: args.author});
       },
        promo(parent, args,context, info) {
            console.log(context.user)
            if(!args.author){
                return Promo.find({});
            }
             return Promo.findOne({id: args.id});
       }
    },
    Mutation: {
        createProduct(parent,args, context, info){
            let product = new Product({
                id: args.id,
                description: args.description,
                price: args.price,
                expiringDate: args.expiringDate
            });
            product.save();
        },
        createTicket(parent, args,context, info){
            let ticket = new Ticket({
                date: args.date,
                author: args.author,
                type: args.type,
                data: args.data,
            })
            return ticket.save()
        },
        createMenu(parent, args,context, info){
            let menu = new Menu({
                name: args.name,
                description: args.description,
                products: args.products,
                price: args.price,
            })
            return menu.save()
        },
        createPromo(parent, args,context, info){
            let promo = new Promo({
                name: args.name,
                description: args.description,
                menus: args.menus,
                price: args.price,
            })
            return promo.save()
        },
        createUser: async(parent, args, context, info) => {         
            const hashedPassword = await bcrypt.hash(args.password, 10)
            let user = new User({
                email: args.email, 
                password: hashedPassword, 
            })
            return user.save()
        },
        login: async( parents, args, context, info) => {
            const user = await User.findOne({email:args.email});

            if(!user) throw new Error("user doesn't exists")

            const passwordChecked = await bcrypt.compare(args.password, user.password)

             if(!passwordChecked) throw new Error("password is incorrect")

            const token = jwt.sign({ userId: user._id, email: user.email },'supersecretkey', {
                        expiresIn: '1h'
                    })
     
            return { 
                userId: user._id, 
                token: token, 
                tokenExpiration: 1 }
        }
    }
}

/* index */
try {
   mongoose.connect('mongodb+srv://devuser:1111@cluster0.duiue.mongodb.net/haozi', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    err => console.log(err);
 }
mongoose.connection.once('open', function() {
console.log('mongoose ok')
});

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const user = { 
            userId: "02200",
            token: "String!",
            tokenExpiration: 1
        }
    console.log(user)
    }
});

server.start( () => {console.log('graphql-yoga running on http://localhost:4000/')})