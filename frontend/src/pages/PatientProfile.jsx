import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/patients/profile/${userId}`
        );

        setPatient(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          password: "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/patients/profile/${userId}`,
        formData
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setSuccess("Error updating profile.");
    }
  };

  if (!patient) return <p>Loading profile...</p>;

  return (
    <div className="profile-wrapper">
      <h2>Patient Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>New Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Leave empty to keep same"
        />

        <button type="submit">Update Profile</button>
        {success && <p>{success}</p>}
      </form>
    </div>
  );
};

export default PatientProfile;
