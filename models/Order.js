
const mongoose = require("mongoose");
const customerModel=require('./Customer').customerModel;
const productModel=require('./Product').productModel;

const orderSchema=new mongoose.Schema({
    orderedby:{type:mongoose.ObjectId, ref:customerModel, required:true},
    product:{type:mongoose.ObjectId,ref:productModel, required:true},
    productqty: { type: Number, required:true },
    
});


exports.orderModel = mongoose.model("order", orderSchema);