import React from "react";
import axios from "axios";

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      // 1. Create Razorpay order from backend
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: 500, // amount in INR (₹5.00) in *paise* => 500 = ₹5
        }
      );

      const options = {
        key: (RAZORPAY_KEY_ID = rzp_test_1DP5mmOlF5G5ag), // Replace with your test key or env var later
        amount: data.amount,
        currency: "INR",
        name: "Hospital Booking",
        description: "Doctor Appointment",
        order_id: data.id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log("Payment response:", response);
          // Optionally call backend to save payment info
        },
        prefill: {
          name: "Test Patient",
          email: "test@example.com",
        },
        notes: {
          appointmentId: "optional-id",
        },
        theme: {
          color: "#00b894",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log("Payment Error:", error);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Pay ₹5 (Test)
    </button>
  );
};

export default PaymentButton;
