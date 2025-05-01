const mongoose = require ('mongoose');


const orderSchema =new mongoose.Schema({
    orderItems:[{
        productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    }
    }],
    number:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    totalPrice:{
        type:Number,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SignupModel'
    },
    dateOrdered:{
        type:Date,
        default:Date.now
    }
});


// orderSchema.virtual('id').get(function() {
//     return this._id.toHexString();
// });
  
// orderSchema.set('toJSON', {
//     virtuals: true
// });


const Order = new mongoose.model('Order' , orderSchema)

module.exports = Order;