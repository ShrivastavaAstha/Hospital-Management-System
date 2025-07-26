import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        toast.error("Failed to load patient details 😢");
      }
    };
    fetchPatient();
  }, [patientId]);

  if (!patient)
    return <div className="patient-loading">Loading patient details...</div>;

  return (
    <>
      <div className="patient-details-container">
        <ToastContainer />
        <div className="patient-card">
          <h2>👤 Patient Profile</h2>

          <div className="info-section">
            <div>
              <strong>Name:</strong> {patient.name}
            </div>
            <div>
              <strong>Email:</strong> {patient.email}
            </div>
            <div>
              <strong>Age:</strong> {patient.age || "N/A"}
            </div>
            <div>
              <strong>Gender:</strong> {patient.gender || "N/A"}
            </div>
            <div>
              <strong>Blood Group:</strong> {patient.bloodGroup || "N/A"}
            </div>
            <div>
              <strong>Address:</strong> {patient.address || "N/A"}
            </div>
            <div>
              <strong>Emergency Contact:</strong>{" "}
              {patient.emergencyContact || "N/A"}
            </div>
          </div>

          <div className="info-section">
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

          <div className="info-section">
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
        </div>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </>
  );
};

export default PatientDetails;
