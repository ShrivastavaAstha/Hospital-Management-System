import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import confetti from "canvas-confetti";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    phone: "",
    availability: "",
    profilePhoto: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.role === "doctor") {
          localStorage.setItem("doctorId", res.data.user._id);
        }

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        const role = res.data.user.role;
        if (role === "admin") navigate("/dashboard");
        else if (role === "doctor") navigate("/doctor-dashboard");
        else navigate("/patient-dashboard");
      } else {
        const formData = new FormData();
        for (let key in form) {
          formData.append(key, form[key]);
        }

        await axios.post("http://localhost:5000/api/auth/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.4 },
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login to Your Account" : "Create an Account"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          )}

          {/* Show doctor-specific fields if role is doctor */}
          {!isLogin && form.role === "doctor" && (
            <>
              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                <option value="Cardiologist">Cardiologist (Chest Pain)</option>
                <option value="Dermatologist">Dermatologist (Skin Rash)</option>
                <option value="General Physician">
                  General Physician (Fever / Cough)
                </option>
                <option value="Dentist">Dentist (Toothache)</option>
                <option value="Orthopedic">Orthopedic (Joint Pain)</option>
                <option value="Ophthalmologist">
                  Ophthalmologist (Eye Irritation)
                </option>
              </select>

              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) {
                    setForm({ ...form, phone: val });
                  }
                }}
                pattern="\d{10}"
                title="Phone number must be exactly 10 digits"
                required
              />
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                required
              >
                <option value="">Select Availability</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Both">Both</option>
              </select>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>

        <p className="toggle">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsLogin(false)}>Register</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </>
          )}
        </p>
      </div>

      {/* Animated SVG Waves */}
      <svg className="wave" viewBox="0 0 1440 320">
        <path
          fill="#8ec5fc"
          fillOpacity="1"
          d="M0,160L30,165.3C60,171,120,181,180,181.3C240,181,300,171,360,154.7C420,139,480,117,540,106.7C600,96,660,96,720,101.3C780,107,840,117,900,138.7C960,160,1020,192,1080,181.3C1140,171,1200,117,1260,117.3C1320,117,1380,171,1410,197.3L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default Auth;
