const Razorpay = require("razorpay");
const Appointment = require("../models/Appointment");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// exports.createOrder = async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const options = {
//       amount: amount * 100, // Amount in paise
//       currency: "INR",
//       receipt: "receipt_order_" + Date.now(),
//     };

//     const order = await instance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     console.error("🔴 Razorpay Error:", err); // 👈 LOG THE ERROR HERE
//     res.status(500).json({ success: false, error: "Order creation failed" });
//   }
// };
// controllers/paymentController.js
exports.createOrder = async (req, res) => {
  try {
    // Fake/mock response for now
    const mockOrder = {
      id: "order_mock123456",
      currency: "INR",
      amount: 50000,
    };

    res.status(200).json({ success: true, order: mockOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { appointmentId, razorpayPaymentId } = req.body;

  try {
    // You may also verify the signature here if needed

    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: "Paid",
    });

    res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Payment verification failed" });
  }
};
