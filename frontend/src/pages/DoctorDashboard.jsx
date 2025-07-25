import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const doctor = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/appointments/doctor/${doctor._id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, [doctor._id]);

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter(
    (a) => a.appointmentDate === today
  );
  const upcomingAppointments = appointments.filter(
    (a) => a.appointmentDate > today
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed"
  );

  return (
    <div className="doctor-dashboard-container">
      <header className="dashboard-header">
        <img
          src={
            doctor.profilephoto
              ? `/uploads/${doctor.profilephoto}`
              : "/default.png"
          }
          alt="Doctor Profile"
          className="doctor-profile-pic"
        />
        <h1>Welcome, Dr. {doctor.name}</h1>
        <button onClick={() => navigate("/doctor/profile")}>My Profile</button>
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅️
        </button>
      </header>

      <div className="stats-cards">
        <div className="card card-blue">
          <p className="label">📅 Today’s Appointments</p>
          <p className="value">{todaysAppointments.length}</p>
        </div>
        <div className="card card-green">
          <p className="label">🕒 Upcoming</p>
          <p className="value">{upcomingAppointments.length}</p>
        </div>
        <div className="card card-purple">
          <p className="label">✅ Completed</p>
          <p className="value">{completedAppointments.length}</p>
        </div>
      </div>

      <div className="appointments-table">
        <h2>📋 All Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>{appt.patientId?.name}</td>
                    <td>{appt.appointmentDate}</td>
                    <td>{appt.appointmentTime}</td>
                    <td>{appt.status || "Scheduled"}</td>
                    <td>{appt.paymentStatus || "N/A"}</td>
                    <td>
                      <Link to={`/chat/${doctor._id}/${appt.patientId?._id}`}>
                        <button>Chat</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
