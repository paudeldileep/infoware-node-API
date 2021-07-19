const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String,required:true },
    email: { type: String, unique: true,required:true },
    password: { type: String, required:true },
    token: { type: String }
});


exports.customerSchema=customerSchema;
exports.customerModel = mongoose.model("customer", customerSchema);