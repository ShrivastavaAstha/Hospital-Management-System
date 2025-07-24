import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/patient/next-appointment/${user._id}`
        );
        setNextAppointment(res.data);
      } catch (err) {
        console.error("Failed to fetch next appointment:", err);
      }
    };
    fetchNextAppointment();
  }, [user._id]);

  return (
    <div className="patient-dashboard-container">
      <div className="glass-card">
        <div className="dashboard-header">
          <div>
            <h1>👋 Welcome, {user.name}</h1>
            <p className="subtext">
              You can manage your health, book new appointments, and view your
              history below.
            </p>
          </div>
          <button
            onClick={() => navigate("/patient/profile")}
            className="profile-button"
          >
            My Profile
          </button>
          <LogoutButton />
        </div>

        {/* Next Appointment Section */}
        <div className="next-appointment">
          <h2>🗓️ Your Next Appointment</h2>
          {nextAppointment ? (
            <div className="appointment-card">
              <p>
                <strong>Doctor:</strong>{" "}
                {nextAppointment.doctorId?.name || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {nextAppointment.appointmentDate}
              </p>
              <p>
                <strong>Time:</strong> {nextAppointment.appointmentTime}
              </p>
              <p>
                <strong>Status:</strong> {nextAppointment.paymentStatus}
              </p>
            </div>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </div>

        <div className="action-buttons">
          <button
            className="book-btn"
            onClick={() => navigate("/book-appointment")}
          >
            ➕ Book Appointment
          </button>
          <button
            className="history-btn"
            onClick={() => navigate("/my-appointments")}
          >
            📖 View Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
