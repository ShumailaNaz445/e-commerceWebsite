const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productImage:String,
    productName:String,
    price:String,
    description:String,
    category:String
})
const productModel = new mongoose.model('product' , ProductSchema);

module.exports = productModel;
