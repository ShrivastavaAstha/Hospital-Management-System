import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch dashboard stats
    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err));

    // Fetch all doctors
    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Failed to fetch doctors", err));

    // Fetch all appointments
    axios
      .get("http://localhost:5000/api/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Fetched Appointments:", res.data); // ✅ DEBUGGING
        setAppointments(res.data);
      })
      .catch((err) => console.error("Failed to fetch appointments", err));
  }, []);

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`);
      setDoctors(doctors.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete doctor");
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/doctors/add",
        {
          name,
          specialization,
          phone,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Doctor added successfully!");
      setDoctors((prev) => [...prev, res.data.doctor]);
      setName("");
      setSpecialization("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Add doctor error:", err.response?.data || err.message);
      alert("Error adding doctor");
    }
  };

  if (!stats)
    return <div className="text-center mt-20">Loading dashboard...</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="p-6">
        <LogoutButton />
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Admin Dashboard
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
            <h3 className="text-sm text-gray-600">Doctors</h3>
            <p className="text-2xl font-bold text-blue-800">
              {stats.totalDoctors}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow text-center">
            <h3 className="text-sm text-gray-600">Appointments</h3>
            <p className="text-2xl font-bold text-green-800">
              {stats.totalAppointments}
            </p>
          </div>
          <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
            <h3 className="text-sm text-gray-600">Revenue (₹)</h3>
            <p className="text-2xl font-bold text-purple-800">
              {stats.totalRevenue}
            </p>
          </div>
        </div>

        {/* Add Doctor */}
        <form onSubmit={handleAddDoctor} className="space-y-2 mb-10">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Doctor Name"
          />
          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
            placeholder="Specialization"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Phone"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <button type="submit">Add Doctor</button>
        </form>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-4 shadow rounded-xl">
            <h4 className="text-center font-semibold mb-4">
              Appointments Trend
            </h4>
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

          <div className="bg-white p-4 shadow rounded-xl">
            <h4 className="text-center font-semibold mb-4">Revenue per Day</h4>
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

        {/* Manage Doctors */}
        <h3 className="text-xl font-bold mt-12 mb-4">Manage Doctors</h3>
        {doctors.length === 0 ? (
          <p className="text-gray-600">No doctors found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Specialization</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td className="py-2 px-4 border">{doc.name}</td>
                    <td className="py-2 px-4 border">{doc.specialization}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteDoctor(doc._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments */}
        <h3 className="text-xl font-semibold mt-8 mb-2">Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="min-w-full border mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Doctor</th>
                <th className="py-2 px-4 border">Patient</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Time</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const doctorName =
                  appt?.doctorId && typeof appt.doctorId === "object"
                    ? appt.doctorId.name || "Unnamed Doctor"
                    : "Doctor Not Found";

                const patientName =
                  appt?.patientId && typeof appt.patientId === "object"
                    ? appt.patientId.name || "Unnamed Patient"
                    : "Patient Not Found";

                return (
                  <tr key={appt._id}>
                    <td className="py-2 px-4 border">{doctorName}</td>
                    <td className="py-2 px-4 border">{patientName}</td>
                    <td className="py-2 px-4 border">{appt.appointmentDate}</td>
                    <td className="py-2 px-4 border">{appt.appointmentTime}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteAppointment(appt._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
