// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import NotFoundAnimation from "../assets/404-animation.json"; // 👈 Use a Lottie file here
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="animation">
        <Lottie animationData={NotFoundAnimation} loop={true} />
      </div>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="home-btn">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
