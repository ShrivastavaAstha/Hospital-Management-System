import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorAppointments = () => {
  const doctor = JSON.parse(localStorage.getItem("user"));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (doctor?._id) {
      axios
        .get(`http://localhost:5000/api/appointments/doctor/${doctor._id}`)
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [doctor]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          My Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Patient</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Payment</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td className="py-2 px-4 border">
                      {appt.patientId?.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">{appt.appointmentDate}</td>
                    <td className="py-2 px-4 border">{appt.appointmentTime}</td>
                    <td className="py-2 px-4 border">{appt.paymentStatus}</td>
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

export default DoctorAppointments;
