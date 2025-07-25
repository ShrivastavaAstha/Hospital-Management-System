import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./PatientDetails.css";

const PatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`/patients/profile/${patientId}`);
        setPatient(res.data);
      } catch (error) {
        console.error("Failed to fetch patient:", error);
      }
    };
    fetchPatient();
  }, [patientId]);

  if (!patient) return <p className="loading">Loading patient details...</p>;

  return (
    <div className="patient-card">
      <h2 className="patient-title">👤 Patient Profile</h2>
      <div className="patient-section">
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Age:</strong> {patient.age || "N/A"}
        </p>
        <p>
          <strong>Gender:</strong> {patient.gender || "N/A"}
        </p>
        <p>
          <strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {patient.address || "N/A"}
        </p>
        <p>
          <strong>Emergency Contact:</strong>{" "}
          {patient.emergencyContact || "N/A"}
        </p>
      </div>

      <div className="patient-section">
        <h3>🩺 Medical History</h3>
        {patient.medicalHistory?.length ? (
          <ul>
            {patient.medicalHistory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No medical history provided.</p>
        )}
      </div>

      <div className="patient-section">
        <h3>🌿 Allergies</h3>
        {patient.allergies?.length ? (
          <ul>
            {patient.allergies.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No allergies listed.</p>
        )}
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </div>
  );
};

export default PatientDetails;
