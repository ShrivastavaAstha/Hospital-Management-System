import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/auth");
    } else {
      const role = user.role;
      if (role === "admin") navigate("/dashboard");
      else if (role === "doctor") navigate("/doctor-dashboard");
      else navigate("/patient-dashboard");
    }
  }, [navigate]);

  return <div className="text-center mt-20">Redirecting...</div>;
};

export default HomeRedirect;
