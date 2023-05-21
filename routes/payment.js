import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/payment.js";

const router = express.Router();

router.route("/checkout/:id").post(checkout);

router.route("/paymentverification/:id").post(paymentVerification);

export default router;