import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./MyAppointment.css";

const MyAppointments = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = () => {
    axios
      .get(`/appointments/patient/${user._id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAppointments();
  }, [user._id]);

  const handleCancel = async (id) => {
    try {
      await axios.delete(`/appointments/${id}`);
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
                  <Link to={`/chat/${user._id}/${appt.doctorId?._id}`}>
                    <button>Chat</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </div>
  );
};

export default MyAppointments;
