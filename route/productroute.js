// const express = require('express');
const route = require ('express').Router();
const productController = require ('../controller/productcontroller');


route.post("/addproduct" , productController.upload.single('productImage'),productController.addProduct);

route.put(`/updateproduct/:id` , productController.updateProduct);

route.delete("/deleteproduct/:id" , productController.deleteProduct);

route.get("/getproduct" , productController.getProduct)




module.exports = route
