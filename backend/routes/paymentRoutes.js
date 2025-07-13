const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment); // 👈 this route updates paymentStatus

module.exports = router;
