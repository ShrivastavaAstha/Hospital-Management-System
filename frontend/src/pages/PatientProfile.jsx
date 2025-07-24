import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientProfile = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
    allergies: "",
    emergencyContact: "",
  });
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/patients/profile/${userId}`
        );

        const data = res.data;
        setPatient(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          password: "",
          age: data.age || "",
          gender: data.gender || "",
          address: data.address || "",
          bloodGroup: data.bloodGroup || "",
          medicalHistory: data.medicalHistory?.join(", ") || "",
          allergies: data.allergies?.join(", ") || "",
          emergencyContact: data.emergencyContact || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        medicalHistory: formData.medicalHistory
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        allergies: formData.allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await axios.put(
        `http://localhost:5000/api/patients/profile/${userId}`,
        updatedData
      );
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setSuccess("Error updating profile.");
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("profilephoto", selectedImage);

    try {
      await axios.put(
        `http://localhost:5000/api/patients/profile-picture/${userId}`,
        formData
      );
      alert("Profile picture updated");
    } catch {
      alert("Image upload failed");
    }
  };

  if (!patient) return <p>Loading profile...</p>;

  return (
    <div className="profile-wrapper">
      <h2>Your Profile</h2>
      {patient.profilephoto && (
        <div className="profile-photo-container">
          <img
            src={
              patient.profilephotoPreview // show selected image before uploading
                ? patient.profilephotoPreview
                : patient.profilephoto // show uploaded image
                ? `http://localhost:5000/uploads/${patient.profilephoto}`
                : `http://localhost:5000/uploads/default.png` // fallback
            }
            alt="Profile"
            className="profile-img-circle"
          />
        </div>
      )}

      <div className="form-group">
        <label>Upload Profile Picture:</label>
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
                setPatient((prev) => ({
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

        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">-- Select Gender --</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>Blood Group</label>
        <input
          type="text"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
        />

        <label>Medical History </label>
        <input
          type="text"
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
        />

        <label>Allergies </label>
        <input
          type="text"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
        />

        <label>Emergency Contact</label>
        <input
          type="number"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
        />

        <button type="submit">Update Profile</button>
        {success && <p>{success}</p>}
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </div>
  );
};

export default PatientProfile;
