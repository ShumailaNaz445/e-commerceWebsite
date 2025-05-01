const OrderModel = require ('../model/order');
const productModel = require('../model/product');


const placeOrder = (req , res) => {
    try {
        const { orderItems , totalPrice , number , user , status , email , address } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).send({ message: "Order items are required" });
        }
        if (!number || !email || !address) {
            return res.status(400).send({ message: "Phone number, email, and address are required" });
        }
        else{
            const savedOrder = new OrderModel({
                orderItems,
                totalPrice,
                number,
                email,
                address,
                user,
                status
            })
            savedOrder.save()
            res.send({
                status:200,
                message:"Order Successfully saved",
                data:savedOrder
            })
        }
} catch (error) {
        res.status(500).send({
            error:error.message,
            message:"order Error"
        })
    }
} 




module.exports = placeOrder;