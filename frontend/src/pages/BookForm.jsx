import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookForm.css";
import { useParams, useNavigate } from "react-router-dom";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  // const user = JSON.parse(localStorage.getItem("user"));
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const doctorId = id;
    console.log("Doctor ID:", doctorId);

    axios
      .get(`http://localhost:5000/api/doctors/${doctorId}`)
      .then((res) => {
        console.log("Doctor data fetched:", res.data);
        setDoctor(res.data);
      })
      .catch((err) => {
        console.log("Error fetching doctor:", err.message);
      });
  }, [id]);

  useEffect(() => {
    if (doctor && date) {
      axios
        .get(`http://localhost:5000/api/appointments/user/booked-slots`, {
          params: { doctorId: doctor._id, date },
        })
        .then((res) => setBookedSlots(res.data))
        .catch((err) => console.log("Error fetching booked slots:", err));
    }
  }, [doctor, date]);
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!doctor || !date || !time) {
      alert("Please select doctor, date and time");
      return;
    }

    try {
      // 1. Create Appointment first with Pending status
      const appointmentRes = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId: doctor._id,
          patientId: user._id,
          appointmentDate: date,
          appointmentTime: time,
          paymentStatus: "Pending",
        }
      );

      const appointmentId = appointmentRes.data._id;

      // 2. Create Razorpay Order
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: 500, // ₹500 in paise
          appointmentId,
        }
      );

      const { order } = orderRes.data;

      // 3. Razorpay Payment Options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_dummy123", // Replace with your test key
        amount: order.amount,
        currency: "INR",
        name: "Hospital Management",
        description: "Appointment Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 4. Verify & Update Appointment Status
            await axios.post("http://localhost:5000/api/payment/verify", {
              razorpayPaymentId: response.razorpay_payment_id,
              appointmentId,
            });

            alert("Payment successful & appointment confirmed!");
            navigate("/my-appointments");
          } catch (error) {
            console.error("Verification failed:", error);
            alert("Payment successful but verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // const rzp = new window.Razorpay(options);
      // rzp.open();
      const simulate = window.confirm("Simulate Razorpay payment success?");

      if (simulate) {
        // Simulate successful payment
        await axios.post("http://localhost:5000/api/payment/verify", {
          razorpayPaymentId: "test_payment_id_123", // dummy ID
          appointmentId, // this should come from appointment booking response
        });

        alert("Simulated: Appointment booked successfully!");
        navigate("/my-appointments");
      } else {
        alert("Simulated: Payment failed, appointment pending.");
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert("Failed to book appointment.");
    }
  };

  if (!doctor)
    return (
      <div className="booking-container">
        <div className="loader">Loading doctor info...</div>
      </div>
    );

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>🩺 Book with {doctor.name}</h2>

        {message && <p className="success-msg">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Select Time:</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="">-- Select a time --</option>
            {timeSlots.map((slot) => (
              <option
                key={slot}
                value={slot}
                disabled={bookedSlots.includes(slot)}
              >
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </option>
            ))}
          </select>

          <button type="submit">✅ Confirm Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
