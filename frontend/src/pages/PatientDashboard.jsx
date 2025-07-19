import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fake preview appointment data (replace with real API later)
  const nextAppointment = {
    doctor: "Dr. Sharma",
    date: "2025-07-18",
    time: "10:30 AM",
    status: "Confirmed",
  };

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
          <LogoutButton />
        </div>

        {/* Next Appointment Section */}
        <div className="next-appointment">
          <h2>🗓️ Your Next Appointment</h2>
          {nextAppointment ? (
            <div className="appointment-card">
              <p>
                <strong>Doctor:</strong> {nextAppointment.doctor}
              </p>
              <p>
                <strong>Date:</strong> {nextAppointment.date}
              </p>
              <p>
                <strong>Time:</strong> {nextAppointment.time}
              </p>
              <p>
                <strong>Status:</strong> {nextAppointment.status}
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
