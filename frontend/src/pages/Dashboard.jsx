import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const doctorSectionRef = useRef(null);
  const appointmentSectionRef = useRef(null);
  const scrollToDoctors = () => {
    doctorSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAppointments = () => {
    appointmentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err));

    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Doctors fetch error:", err));

    axios
      .get("http://localhost:5000/api/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Appointments fetch error:", err));
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/doctors/add",
        {
          name,
          specialization,
          availability,
          phone,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Doctor added!");
      setDoctors([...doctors, res.data.doctor]);
      setName("");
      setSpecialization("");
      setAvailability("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Error adding doctor");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      setDoctors(doctors.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete doctor");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!stats)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Dashboard...
      </div>
    );

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        {/* <a href="/dashboard">Dashboard</a> */}
        <button
          onClick={scrollToDoctors}
          className="sidebar-link"
          style={{ backgroundColor: "transparent" }}
        >
          Doctors
        </button>
        <button
          onClick={scrollToAppointments}
          className="sidebar-link"
          style={{ backgroundColor: "transparent" }}
        >
          Appointments
        </button>

        <button onClick={handleLogout} style={{ marginTop: "40px" }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <h1>Welcome, Admin</h1>
        </div>
        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <h3>Doctors</h3>
            <p>{stats.totalDoctors}</p>
          </div>
          <div className="stat-card">
            <h3>Appointments</h3>
            <p>{stats.totalAppointments}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue (₹)</h3>
            <p>{stats.totalRevenue}</p>
          </div>
        </div>
        {/* Add Doctor */}
        <h3>Add New Doctor</h3>
        <form onSubmit={handleAddDoctor}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Doctor Name"
            required
            type="text"
          />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          >
            <option value="">Select Specialization</option>
            <option value="Cardiologist">Cardiologist (Chest Pain)</option>
            <option value="Dermatologist">Dermatologist (Skin Rash)</option>
            <option value="General Physician">
              General Physician (Fever / Cough)
            </option>
            <option value="Dentist">Dentist (Toothache)</option>
            <option value="Orthopedic">Orthopedic (Joint Pain)</option>
            <option value="Ophthalmologist">
              Ophthalmologist (Eye Irritation)
            </option>
          </select>
          <select
            name="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
          >
            <option value="">Select Availability</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Both">Both</option>
          </select>

          <input
            value={phone}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,10}$/.test(val)) {
                setPhone(val);
              }
            }}
            placeholder="Phone"
            required
            type="number"
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Add Doctor</button>
        </form>
        {/* Charts */}
        <div className="section">
          <div className="chart-container">
            <h4>Appointments Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.appointmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Revenue per Day</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenueStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Doctor Table */}
        <h3 ref={doctorSectionRef} style={{ marginTop: "40px" }}>
          Manage Doctors
        </h3>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="filter">Filter by Specialization: </label>
          <select
            id="filter"
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
          >
            <option value="">All</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Dentist">Dentist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Ophthalmologist">Ophthalmologist</option>
          </select>
        </div>

        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors
                .filter((doc) =>
                  filterSpecialization
                    ? doc.specialization === filterSpecialization
                    : true
                )
                .map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteDoctor(doc._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {/* Appointment Table */}
        <h3 ref={appointmentSectionRef} style={{ marginTop: "40px" }}>
          Appointments
        </h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt?.doctorId?.name || "Unknown"}</td>
                  <td>{appt?.patientId?.name || "Unknown"}</td>
                  <td>{appt.appointmentDate}</td>
                  <td>{appt.appointmentTime}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleDeleteAppointment(appt._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
