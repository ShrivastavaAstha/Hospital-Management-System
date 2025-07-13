import React, { useEffect, useState } from "react";
import axios from "axios";

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
      fetchAppointments(); // refresh list after cancellation
    } catch (err) {
      console.error("Cancel error:", err.message);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          My Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Photo</th>
                  <th className="py-2 px-4 border">Doctor</th>
                  <th className="py-2 px-4 border">Specialization</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td className="py-2 px-4 border">
                      <img
                        src={
                          appt.doctorId?.photo ||
                          "https://via.placeholder.com/40"
                        }
                        alt="Doctor"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-2 px-4 border">{appt.doctorId?.name}</td>
                    <td className="py-2 px-4 border">
                      {appt.doctorId?.specialization}
                    </td>
                    <td className="py-2 px-4 border">{appt.appointmentDate}</td>
                    <td className="py-2 px-4 border">{appt.appointmentTime}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                    <th className="py-2 px-4 border">Payment Status</th>
                    ...
                    <td className="py-2 px-4 border">
                      {appt.paymentStatus === "Paid" ? (
                        <span className="text-green-600 font-medium">Paid</span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Pending
                        </span>
                      )}
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

export default MyAppointments;
