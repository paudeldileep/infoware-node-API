var express = require("express");
var bcrypt = require("bcryptjs");
var router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const ObjectId = require('mongoose').Types.ObjectId;

const customerModel = require("../models/Customer").customerModel;
const productModel = require("../models/Product").productModel;
const { orderModel } = require("../models/Order");

//customer/add  : customer register
router.post("/add", async (req, res) => {
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All fields are required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await customerModel.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const customer = await customerModel.create({
      name: name,
      email: email.toLowerCase(), // sanitize
      password: encryptedUserPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: customer._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    // save customer token
    customer.token = token;

    // return new customer
    res.status(201).json(customer);
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

//customer/login  : customer login and jwt token as response
router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("Please provide valid email and password");
    }
    // Validate if user exist in our database
    const customer = await customerModel.findOne({ email });

    if (customer && (await bcrypt.compare(password, customer.password))) {
      // Create token
      const token = jwt.sign(
        { customer_id: customer._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      // save customer token
      customer.token = token;

      // customer
      return res.status(200).json(customer);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    return res.status(400).send("Something went Wrong");
  }
});

//customer/browse-products   : browse all products by authorized customer

router.get("/browse-products", auth, async (req, res) => {
  try {
    const products = await productModel.find({});

    if (products.length === 0) {
      res.status(200).json({ message: "No products Found" });
    }

    res.status(200).send(products);
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went Wrong");
  }
});

////customer/order  : place order by customer order

router.post("/order", auth, async (req, res) => {
  //insert multiple docs obtained as array of orders
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: "Please include atleast an item" });
    }
    const orders = await orderModel.create(req.body);
    res.status(201).send(orders);
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went Wrong");
  }
});

////customer/order  : get orders made by customer

router.get("/orders", auth, async (req, res) => {
    //get all orders made by specific customer
    try {
        
    //   if (!req.user) {
    //     return res
    //       .status(400)
    //       .json({ message: "Not a valid user" });
    //   }

    const customer_id=new ObjectId(req.user.customer_id);

    console.log(customer_id);

      const orders = await orderModel.find({orderedby: customer_id}).populate('product').exec();
      res.status(200).send(orders);
    } catch (err) {
      console.log(err);
      res.status(400).send("Something went Wrong");
    }
  });

module.exports = router;
