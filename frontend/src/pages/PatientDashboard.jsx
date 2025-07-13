import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="p-6">
        <LogoutButton />
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name} 🧑‍⚕️</h2>
        <p className="mb-6 text-gray-600">
          You can book appointments and view your history below.
        </p>

        <div className="flex gap-6">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/book-appointment")}
          >
            Book Appointment
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => navigate("/my-appointments")}
          >
            My Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
