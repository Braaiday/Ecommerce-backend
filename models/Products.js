const {Schema, model} = require("../db/connection") // import Schema & model

// User Schema
const ProductSchema = new Schema({
    productname: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: ""},
    inStockQuantity: {type: Number, required: true, default: 0},

})

// User model
const Product = model("Todo", ProductSchema)

module.exports = Product