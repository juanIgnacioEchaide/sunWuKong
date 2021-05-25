
const mongoose = require('mongoose');
const { Number, Schema, model, ObjectId } = mongoose;

const productSchema = new Schema({
    id: Number,
    description: String, 
    expiringDate: String,
    price: Number, 
})

export const Product = model('Product', productSchema);

const menuSchema = new Schema({
    id: Number,
    name: String, 
    description: String, 
    products: [productSchema],
    price: Number, 
})

export const Menu = model('Menu', menuSchema);

const promoSchema = new Schema({
    id: Number,
    name: String, 
    description: String, 
    menus: [menuSchema],
    price: Number, 
})

export const Promo = model('Promo', promoSchema);

const ticketSchema = new Schema({
    id: Number,
    author: String, 
    type: String, 
    date: String, 
    data: [productSchema],
})

export const Ticket = model('Ticket', ticketSchema);

const userSchema = new Schema({
    id: Number,
    email: String, 
    password: String, 
    name: String, 
    authorId: String,
})

export const User = model('User',userSchema);