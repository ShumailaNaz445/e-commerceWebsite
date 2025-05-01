const route = require ('express').Router();
const orderController = require ('../controller/ordercontroller');

route.post('/orderplacement' , orderController)






module.exports = route