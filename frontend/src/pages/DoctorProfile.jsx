import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setDoctor(res.data))
      .catch((err) => {
        console.error(
          "Error fetching profile",
          err.response?.data || err.message
        );
      });
  }, []);

  if (!doctor) return <div>Loading profile...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Doctor Profile</h2>
      <p>
        <strong>Name:</strong> {doctor.name}
      </p>
      <p>
        <strong>Email:</strong> {doctor.email}
      </p>
      <p>
        <strong>Phone:</strong> {doctor.phone}
      </p>
      <p>
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
    </div>
  );
};

export default DoctorProfile;
