const {Schema, model} = require("../db/connection") // import Schema & model

// User Schema
const ProductSchema = new Schema({
    productname: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: ""},
    inStockQuantity: {type: Number, required: true, default: 0},
    category: {type: String, required: true, default: 'miscellaneous'},
    imgUrl: {type: String, required: false, default: 'no_image.png'}

}, { timestamps: true })

// User model
const Product = model("Product", ProductSchema)

module.exports = Product