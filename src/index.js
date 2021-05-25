import { GraphQLServer } from 'graphql-yoga'
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
import { Product, Ticket, Menu, Promo, User } from './model/models'
 
/* TYPES QUERIES AND MUTATIONS */
const typeDefs = `
    type Query {
        product(id: ID): [Product!]!
        menu(id: ID): [Menu]!
        ticket(author: String): [Ticket]!
        promo(id: ID): [Promo]!
        login(email: String!, password: String!): User!
    }

    type Mutation {
        createProduct(description: String!, price: Float, expiringDate: String!): Product
        createTicket(date: String, author: String, type: String, data: [ProductInput]): Ticket
        createMenu(name: String, description: String, products: [ProductInput], price: Float): Menu
        createPromo(name: String, description: String, menus: [MenuInput], price: Float): Promo
        createUser(email: String, password: String, name: String, authorId: String): User
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
        name: String, 
        authorId: String,
    }

    type AuthData {
        userId: ID!
        token: 
    }
`

/* RESOLVERS FUNCTIONS */
const resolvers = {
    Query: {
        product(parent, args,ctx, info) {
            if(!args.id){
            return Product.find({});
            }
            return Product.findOne({id: args.id});
        },
        menu(parent, args,ctx, info) {
            if(!args.id){
                return Menu.find({});
                }
                return Menu.findById(args.id)
        },
        ticket(parent, args,ctx, info) {
            if(!args.author){
                return Ticket.find({});
            }
             return Ticket.findOne({author: args.author});
       },
        promo(parent, args,ctx, info) {
            if(!args.author){
                return Promo.find({});
            }
             return Promo.findOne({id: args.id});
       }
    },
    Mutation: {
        createProduct(parent,args, ctx, info){
            let product = new Product({
                id: args.id,
                description: args.description,
                price: args.price,
                expiringDate: args.expiringDate
            });
            product.save();
        },
        createTicket(parent, args,ctx, info){
            let ticket = new Ticket({
                date: args.date,
                author: args.author,
                type: args.type,
                data: args.data,
            })
            return ticket.save()
        },
        createMenu(parent, args,ctx, info){
            let menu = new Menu({
                name: args.name,
                description: args.description,
                products: args.products,
                price: args.price,
            })
            return menu.save()
        },
        createPromo(parent, args,ctx, info){
            let promo = new Promo({
                name: args.name,
                description: args.description,
                menus: args.menus,
                price: args.price,
            })
            return promo.save()
        },
        createUser(parent, args,ctx, info){
            let user = new User({
                email: args.email, 
                password: args.password, 
                name: args.name, 
                authorId: args.authorId,
            })


            return user.save()
        },
    },
    login: async({ email, password }) => {
        const user = User.findOne({email:args.email});
        if(!user){
            throw new Error('Uer does not exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if( !isEqual ){
            throw new Error('Password is incorrect, please check it and try again')
        }
    }
}

/* MONGOOSE CONNECTION */
try {
   mongoose.connect('mongodb+srv://devuser:1111@cluster0.duiue.mongodb.net/haozi', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    err => console.log(err);
 }
mongoose.connection.once('open', function() {
console.log('mongoose ok')
});

/* STARTING LOCAL HOST SERVER */
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';

        const user = getUser(token);
        
        if (!user) throw new AuthenticationError('you must be logged in');
        
        return { user };
      },
});

server.start( () => {console.log('graphql-yoga running on http://localhost:4000/')})