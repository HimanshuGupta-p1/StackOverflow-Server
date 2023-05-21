import { instance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";
import mongoose from "mongoose";
import User from '../models/auth.js'
export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  const {id: _id} = req.params;
  let accType = '';
  if (req.body.amount === '500'){
    accType = 'silver';
  }
  else{
    accType = 'gold'
  }
    const updatedProfile = await User.findByIdAndUpdate( _id, { $set: { accountType:accType }}, { new: true } )
  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,accType } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    res.redirect(
      'http://localhost:3000/'
    );
  } else {
    const {id : _id} = req.params;
    const updatedProfile = await User.findByIdAndUpdate( _id, { $set: { accountType:'free' }}, { new: true } )
    res.status(400).json({
      success: false,
    });
  }
};