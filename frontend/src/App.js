import React from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import PatientDashboard from "./pages/PatientDashboard";
import Auth from "./pages/Auth";
import BookAppointment from "./pages/BookAppointment";
import BookForm from "./pages/BookForm";
import MyAppointments from "./pages/MyAppointments";
import PatientProfile from "./pages/PatientProfile";

// Simple protected route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      {/* All your routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/doctor-dashboardprofile" element={<DoctorProfile />} />
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route
          path="/book-appointment"
          element={
            <PrivateRoute>
              <BookAppointment />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <PrivateRoute>
              <MyAppointments />
            </PrivateRoute>
          }
        />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
