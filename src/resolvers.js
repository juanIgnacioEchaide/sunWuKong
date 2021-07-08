import { Product, Ticket, Menu, Promo, User } from './model/models'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const resolvers = {
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
        ticket(parent, args ,context, info) {
            if(!context.user){
              throw new Error("You must log in")
            }
            return Ticket.find({});
       },
        promo(parent, args,context, info) {
            console.log("desde promo", context.user)
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

            if(!user) v

            const passwordChecked = await bcrypt.compare(args.password, user.password)

             if(!passwordChecked) throw new Error("password is incorrect")

            const token = jwt.sign({ userId: user._id, email: user.email },'supersecretkey', {
                        expiresIn: '1h'
                    });

            const loggedUser = { 
                        userId: user._id, 
                        token: token, 
                        tokenExpiration: 1 }
            return loggedUser
        }
    }
}
