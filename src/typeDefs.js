export const typeDefs = `
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
        refreshToken(token: String): AuthData
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