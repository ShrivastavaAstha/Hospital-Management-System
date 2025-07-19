import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const doctorId = localStorage.getItem("doctorId"); // Replace with real ID from auth/context
  console.log("Using doctor ID:", doctorId);

  const [doctor, setDoctor] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/doctors/profile/${doctorId}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => alert("Failed to load doctor data"));
  }, []);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/doctors/profile/${doctorId}`, doctor)
      .then(() => alert("Profile updated successfully"))
      .catch(() => alert("Update failed"));
  };

  const handlePasswordChange = () => {
    axios
      .put(`http://localhost:5000/api/doctors/password/${doctorId}`, passwords)
      .then((res) => alert(res.data.message))
      .catch((err) =>
        alert(err.response?.data?.message || "Error updating password")
      );
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("profilePicture", selectedImage);

    try {
      await axios.put(
        `http://localhost:5000/api/doctors/profile-picture/${doctorId}`,
        formData
      );
      alert("Profile picture updated");
    } catch {
      alert("Image upload failed");
    }
  };

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>

      <div className="form-group">
        <label>Upload Profile Picture:</label>
        <input
          type="file"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
        <button onClick={handleImageUpload}>Upload</button>
        {doctor.profilePicture && (
          <img
            src={`http://localhost:5000/uploads/${doctor.profilePicture}`}
            alt="Profile"
            className="profile-img"
          />
        )}
      </div>

      <div className="form-group">
        <label>Name:</label>
        <input name="name" value={doctor.name || ""} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={doctor.email || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Phone:</label>
        <input
          name="phone"
          value={doctor.phone || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Specialization:</label>
        <input
          name="specialization"
          value={doctor.specialization || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Bio:</label>
        <textarea
          name="bio"
          value={doctor.bio || ""}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-group">
        <label>Availability:</label>
        <input
          name="availability"
          value={doctor.availability || ""}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSave}>Save Changes</button>

      <h3>Change Password</h3>
      <div className="form-group">
        <label>Current Password:</label>
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, currentPassword: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>New Password:</label>
        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
        />
      </div>

      <button onClick={handlePasswordChange} className="btn-yellow">
        Change Password
      </button>
    </div>
  );
};

export default DoctorProfile;
