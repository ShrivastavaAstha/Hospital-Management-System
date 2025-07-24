import React from "react";
import { useNavigate } from "react-router-dom";
import doctorImage from "../assets/landing-doctor.png";
import doctorsgrpImage from "../assets/landing-doctorsgrp.png";
import featuresImage from "../assets/landing-features.png";
import signupImage from "../assets/landing-signup.png";
import apptImage from "../assets/landing-bookappt.png";
import bookingImage from "../assets/landing-booking.png";
import historyImage from "../assets/landing-history.png";
import paymentImage from "../assets/landing-payment.png";
import "./Home.css";
import { motion } from "framer-motion";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  const navigate = useNavigate();
  const { isInstallable, promptInstall } = useInstallPrompt();

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <motion.div
        className="navbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
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
          {isInstallable && (
            <button
              onClick={promptInstall}
              style={{
                backgroundColor: "#0a5c80",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                marginLeft: "10px",
              }}
            >
              📲 Install App
            </button>
          )}
        </div>
      </motion.div>

      {/* HERO SECTION */}
      <div className="hero-section">
        <motion.div
          className="hero-text"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
        >
          <h2>Your Health, Our Priority</h2>
          <p>
            Book appointments, manage medical records, and stay healthy with
            MedCare — Your all-in-one health companion.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/auth")}
          >
            Get Started
          </motion.button>
        </motion.div>
        <motion.div
          className="hero-image"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <img src={featuresImage} alt="Doctor" className="hero-img" />
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <motion.div
        className="features-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <div className="features-grid">
          {[
            { img: bookingImage, title: "Appointment Booking" },
            { img: doctorImage, title: "Verified Doctors" },
            { img: historyImage, title: "Medical History Tracking" },
            { img: paymentImage, title: "Secure Online Payments" },
          ].map((item, idx) => (
            <motion.div className="feature-box" key={idx} variants={fadeInUp}>
              <img src={item.img} alt={item.title} />
              <h4>{item.title}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* HOW IT WORKS */}
      <div className="how-it-works">
        <h2>🔍 How It Works</h2>
        <div className="steps">
          {[
            {
              img: signupImage,
              title: "1. Sign Up",
              desc: "Create a free account to get started with MedCare.",
            },
            {
              img: doctorsgrpImage,
              title: "2. Choose Your Doctor",
              desc: "Find doctors by symptoms, specialization, or ratings.",
            },
            {
              img: apptImage,
              title: "3. Book and Pay",
              desc: "Select date/time and pay securely to confirm your visit.",
            },
          ].map((step, idx) => (
            <motion.div
              className="step"
              key={idx}
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <img src={step.img} alt={step.title} />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="testimonials">
        <h2>💬 What Our Patients Say</h2>
        <motion.div
          className="testimonial-carousel"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            '"MedCare helped me get the right doctor in no time. Smooth and simple experience!"',
            '"One platform for everything — from booking to medical records. Love it!"',
            '"Secure payment and great doctors. I booked a visit in 2 minutes!"',
          ].map((quote, idx) => (
            <motion.div
              className="testimonial-slide"
              key={idx}
              variants={fadeInUp}
            >
              <p>{quote}</p>
              <span>
                -{" "}
                {idx === 0
                  ? "Riya Sharma"
                  : idx === 1
                  ? "Aman Verma"
                  : "Kavita Joshi"}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ABOUT SECTION */}
      <motion.div
        className="about-section"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>📘 About MedCare</h2>
        <p>
          MedCare is a digital healthcare solution that simplifies hospital
          management, helping patients and doctors connect seamlessly.
        </p>
      </motion.div>

      {/* CONTACT SECTION */}
      <motion.div
        className="contact-section"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>📞 Need Help?</h2>
        <p>
          Drop us an email: <strong>support@medcare.com</strong>
        </p>
        <p>
          Or call: <strong>+91 98765 43210</strong>
        </p>
      </motion.div>

      {/* CTA SECTION */}
      <motion.div
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2>Your Health Journey Begins Here</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/auth")}
        >
          Book Appointment Now
        </motion.button>
      </motion.div>

      {/* FOOTER */}
      <motion.div
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <p>&copy; 2025 MedCare. Designed with 💙</p>
      </motion.div>
    </div>
  );
};

export default Home;
