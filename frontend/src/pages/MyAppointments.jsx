import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAppointment.css";

const MyAppointments = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = () => {
    axios
      .get(`http://localhost:5000/api/appointments/patient/${user._id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAppointments();
  }, [user._id]);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Cancel error:", err.message);
    }
  };

  return (
    <div className="appointments-container">
      <div className="appointments-inner">
        <h2>📋 My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="empty-msg">No appointments yet.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appt) => (
              <div className="appointment-card" key={appt._id}>
                <div className="doctor-info">
                  <img
                    src={
                      appt.doctorId?.photo || "https://via.placeholder.com/50"
                    }
                    alt="Doctor"
                  />
                  <div>
                    <h4>{appt.doctorId?.name}</h4>
                    <p>{appt.doctorId?.specialization}</p>
                  </div>
                </div>

                <div className="appt-details">
                  <p>
                    <strong>📅 Date:</strong> {appt.appointmentDate}
                  </p>
                  <p>
                    <strong>🕒 Time:</strong> {appt.appointmentTime}
                  </p>
                </div>

                <div className="status-actions">
                  <p>
                    <strong>💳 Payment:</strong>{" "}
                    {appt.paymentStatus === "Paid" ? (
                      <span className="paid">Paid</span>
                    ) : (
                      <span className="pending">Pending</span>
                    )}
                  </p>
                  <button onClick={() => handleCancel(appt._id)}>
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
