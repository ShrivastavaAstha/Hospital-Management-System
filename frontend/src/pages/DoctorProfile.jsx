import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const doctorId = localStorage.getItem("doctorId");
  console.log("Using doctor ID:", doctorId);

  const [doctor, setDoctor] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/doctors/profile/${doctorId}`)
      .then((res) => {
        console.log("Doctor Data:", res.data);
        setDoctor(res.data);
      })
      .catch((err) => alert("Failed to load doctor data"));
  }, []);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios
      .put(`/doctors/profile/${doctorId}`, doctor)
      .then(() => alert("Profile updated successfully"))
      .catch(() => alert("Update failed"));
  };

  const handlePasswordChange = () => {
    axios
      .put(`/doctors/password/${doctorId}`, passwords)
      .then((res) => alert(res.data.message))
      .catch((err) =>
        alert(err.response?.data?.message || "Error updating password")
      );
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("profilephoto", selectedImage);

    try {
      await axios.put(`/doctors/profile-picture/${doctorId}`, formData);
      alert("Profile picture updated");
    } catch {
      alert("Image upload failed");
    }
  };

  return (
    <div className="profile-container">
      <h2>Doctor Profile</h2>

      {doctor.profilephoto && (
        <div className="profile-photo-container">
          <img
            src={
              doctor.profilephotoPreview // show selected image before uploading
                ? doctor.profilephotoPreview
                : doctor.profilephoto // show uploaded image
                ? `/uploads/${doctor.profilephoto}`
                : `/uploads/default.png` // fallback
            }
            alt="Profile"
            className="profile-img-circle"
          />
        </div>
      )}

      <div className="form-group">
        <label>Upload Profile Picture:</label>
        {/* <input
          type="file"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        /> */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setSelectedImage(file);

            // Show preview immediately
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setDoctor((prev) => ({
                  ...prev,
                  profilephotoPreview: reader.result,
                }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        <button onClick={handleImageUpload}>Upload</button>
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
        <label>Availability:</label>
        <select
          name="availability"
          value={doctor.availability || ""}
          onChange={handleChange}
        >
          <option value="">Select Availability</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Both">Both</option>
        </select>
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

      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </div>
  );
};

export default DoctorProfile;
