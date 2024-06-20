
import crypto from 'crypto';
import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const options = {
            amount: req.body.amount * 100, // Amount in the smallest currency unit
            currency: "USD",
            receipt: `order_${Date.now()}` // Use a unique receipt value
        };

        const order = await razorpay.orders.create(options);

        const newOrder = new orderModel({
            _id: `order_${order.id}`, // Access 'order' after it's defined
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({
            success: true,
            order_id: order.id,
            currency: order.currency,
            amount: order.amount
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  
    try {
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${orderId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');
  
      if (digest !== razorpaySignature) {
        return res.json({ success: false, message: 'Invalid signature' });
      }
  
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

//listing orders for admin panel
const listOrders = async (req, res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

//api for updating order status
const updateStatus = async (req, res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status updated"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
