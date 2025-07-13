import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => {
        console.log("All doctors from DB:", res.data);
        setDoctors(res.data);
        setFilteredDoctors(res.data); // initial load
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSymptomChange = (e) => {
    const symptom = e.target.value;
    setSelectedSymptom(symptom);

    const specialization = symptomMap[symptom];
    console.log("Selected symptom:", symptom);
    console.log("Mapped to specialization:", specialization);

    const filtered = doctors.filter((doc) => {
      console.log("Checking doctor:", doc.name, "-", doc.specialization);
      return (
        doc.specialization.trim().toLowerCase() ===
        specialization.trim().toLowerCase()
      );
    });

    console.log("Filtered doctors:", filtered);

    setFilteredDoctors(filtered);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Book Appointment
        </h2>

        {/* Symptom Dropdown */}
        <div className="mb-6 text-center">
          <label className="mr-2 font-medium">Select Your Symptom:</label>
          <select
            value={selectedSymptom}
            onChange={handleSymptomChange}
            className="p-2 border rounded"
          >
            <option value="">-- Select Symptom --</option>
            {Object.keys(symptomMap).map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor List */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="border p-4 rounded-xl shadow">
                <h3 className="text-xl font-bold">{doc.name}</h3>
                <p className="text-gray-600 mb-2">{doc.specialization}</p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => (window.location.href = `/book/${doc._id}`)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No doctors found for this symptom.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
