import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import doctorImage from "../assets/landing-doctor.png";
import doctorsgrpImage from "../assets/landing-doctorsgrp.png";
import featuresImage from "../assets/landing-features.png";
import signupImage from "../assets/landing-signup.png";
import apptImage from "../assets/landing-bookappt.png";
import bookingImage from "../assets/landing-booking.png";
import historyImage from "../assets/landing-history.png";
import paymentImage from "../assets/landing-payment.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="home-container">
        {/* NAVBAR */}
        <div className="navbar">
          <h1 className="logo">💙 MedCare</h1>
          <div className="nav-links">
            <button
              onClick={() => window.scrollTo({ top: 700, behavior: "smooth" })}
            >
              Features
            </button>
            <button
              onClick={() => window.scrollTo({ top: 1400, behavior: "smooth" })}
            >
              About
            </button>
            <button onClick={() => navigate("/auth")}>Signup</button>
            {/* <button onClick={() => navigate("/register")}>Register</button> */}
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="hero-section">
          <div className="hero-text">
            <h2>Your Health, Our Priority</h2>
            <p>
              Book appointments, manage medical records, and stay healthy with
              MedCare — Your all-in-one health companion.
            </p>

            <button onClick={() => navigate("/auth")}>Get Started</button>
          </div>
          <div className="hero-image">
            {/* <img src={featuresImage} alt="Doctor" className="hero-img" /> */}
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="features-section">
          {/* <h2>✨ Key Features</h2> */}
          <div className="features-grid">
            <div className="feature-box">
              <img src={bookingImage} alt="Appointment" />
              <h4>Appointment Booking</h4>
            </div>
            <div className="feature-box">
              <img src={doctorImage} alt="Appointment" />
              <h4>Verified Doctors</h4>
            </div>
            <div className="feature-box">
              <img src={historyImage} alt="Appointment" />
              <h4>Medical History Tracking</h4>
            </div>
            <div className="feature-box">
              <img src={paymentImage} alt="Appointment" />
              <h4>Secure Online Payments</h4>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="how-it-works">
          <h2>🔍 How It Works</h2>
          <div className="steps">
            <div className="step">
              <img src={signupImage} alt="Sign Up" />
              <h3>1. Sign Up</h3>
              <p>Create a free account to get started with MedCare.</p>
            </div>
            <div className="step">
              <img src={doctorsgrpImage} alt="Sign Up" />
              <h3>2. Choose Your Doctor</h3>
              <p>Find doctors by symptoms, specialization, or ratings.</p>
            </div>
            <div className="step">
              <img src={apptImage} alt="Sign Up" />
              <h3>3. Book and Pay</h3>
              <p>Select date/time and pay securely to confirm your visit.</p>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        {/* TESTIMONIALS */}
        <div className="testimonials">
          <h2>💬 What Our Patients Say</h2>
          <div className="testimonial-carousel">
            <div className="testimonial-slide">
              <p>
                "MedCare helped me get the right doctor in no time. Smooth and
                simple experience!"
              </p>
              <span>- Riya Sharma</span>
            </div>
            <div className="testimonial-slide">
              <p>
                "One platform for everything — from booking to medical records.
                Love it!"
              </p>
              <span>- Aman Verma</span>
            </div>
            <div className="testimonial-slide">
              <p>
                "Secure payment and great doctors. I booked a visit in 2
                minutes!"
              </p>
              <span>- Kavita Joshi</span>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="about-section">
          <h2>📘 About MedCare</h2>
          <p>
            MedCare is a digital healthcare solution that simplifies hospital
            management, helping patients and doctors connect seamlessly.
          </p>
        </div>

        {/* CONTACT SECTION */}
        <div className="contact-section">
          <h2>📞 Need Help?</h2>
          <p>
            Drop us an email: <strong>support@medcare.com</strong>
          </p>
          <p>
            Or call: <strong>+91 98765 43210</strong>
          </p>
        </div>

        {/* CTA SECTION */}
        <div className="cta-section">
          <h2>Your Health Journey Begins Here</h2>
          <button onClick={() => navigate("/auth")}>
            Book Appointment Now
          </button>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <p>&copy; 2025 MedCare. Designed with 💙</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
