import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookAppointment.css";

const symptomMap = {
  "Chest Pain": "Cardiologist",
  "Skin Rash": "Dermatologist",
  "Fever / Cough": "General Physician",
  Toothache: "Dentist",
  "Joint Pain": "Orthopedic",
  "Eye Irritation": "Ophthalmologist",
};

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/doctors")
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data); // initial load
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSymptomChange = (e) => {
    const symptom = e.target.value;
    setSelectedSymptom(symptom);

    const specialization = symptomMap[symptom];
    const filtered = doctors.filter(
      (doc) =>
        doc.specialization.trim().toLowerCase() ===
        specialization.trim().toLowerCase()
    );

    setFilteredDoctors(filtered);
  };

  return (
    <>
      <div className="appointment-container">
        <div className="appointment-card">
          <h2>📋 Book Appointment</h2>

          <div className="symptom-select">
            <label>Select Your Symptom:</label>
            <select value={selectedSymptom} onChange={handleSymptomChange}>
              <option value="">-- Select Symptom --</option>
              {Object.keys(symptomMap).map((symptom) => (
                <option key={symptom} value={symptom}>
                  {symptom}
                </option>
              ))}
            </select>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="doctor-grid">
              {filteredDoctors.map((doc) => (
                <div className="doctor-card" key={doc._id}>
                  <img
                    src={`/uploads/${doc.profilephoto}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://www.w3schools.com/howto/img_avatar.png"; // reliable fallback image
                    }}
                    alt="Doctor"
                    className="doctor-img"
                  />

                  <h3>{doc.name}</h3>
                  <p>
                    <strong>Specialization:</strong> {doc.specialization}
                  </p>
                  <p>
                    <strong>Availability:</strong> {doc.availability}
                  </p>
                  <button
                    onClick={() => (window.location.href = `/book/${doc._id}`)}
                  >
                    Book Now →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-doctor-msg">No doctors found for this symptom.</p>
          )}
        </div>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </>
  );
};

export default BookAppointment;
