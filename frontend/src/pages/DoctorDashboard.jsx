import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const doctor = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/appointments/doctor/${doctor._id}`)
      .then((res) => {
        console.log("Appointments fetched:", res.data);
        setAppointments(res.data);
      })
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
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome Dr. {doctor.name}
        </h2>

        <button onClick={() => navigate("/doctor/profile")}>My Profile</button>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded text-center">
            <p className="text-lg font-semibold">📅 Today’s Appointments</p>
            <p className="text-3xl">{todaysAppointments.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <p className="text-lg font-semibold">🕒 Upcoming</p>
            <p className="text-3xl">{upcomingAppointments.length}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded text-center">
            <p className="text-lg font-semibold">✅ Completed</p>
            <p className="text-3xl">{completedAppointments.length}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3">All Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Patient</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Payment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td className="py-2 px-4 border">{appt.patientId?.name}</td>
                    <td className="py-2 px-4 border">{appt.appointmentDate}</td>
                    <td className="py-2 px-4 border">{appt.appointmentTime}</td>
                    <td className="py-2 px-4 border">
                      {appt.status || "Scheduled"}
                    </td>
                    <td className="py-2 px-4 border">
                      {appt.paymentStatus || "N/A"}
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
