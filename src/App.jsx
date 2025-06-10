// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages (Public)
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import ForgetPass from "./components/ForgetPass/ForgetPass";
import SetNewPass from "./components/SetNewPass/SetNewPass";
import VerificationSuccess from "./components/VerificationSucces/VerificationSuccess";
import VerificationError from "./components/VerificationError/VerificationError";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

// Pages (Protected)
import LandingPageUser from "./components/LandingPage-User/LandingPageUser";
import University from "./components/University/University";
import UniversityIntro from "./components/University/University-intro";
import Bugadune from "./components/Bugadune/Bugadune";
import CSSCrypta from "./components/CSSCrypta/CSSCrypta";
import Forumia from "./components/Forumia/Forumia";
import Playground from "./components/Playground/Playground";
import TowerOfAPIon from "./components/TowerOfAPIon/TowerOfAPIon";
import ProfilNav from "./components/ProfileUser/ProfileUser";
import Chatbot from "./components/Chatbot/Chatbot";
import EditProfile from "./components/EditProfile";

// Layout and Context
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/userIdContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Styling
import "./App.scss";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgetPass" element={<ForgetPass />} />
        <Route path="/users/reset-password/:token" element={<SetNewPass />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-error" element={<VerificationError />} />

        {/* Protected Layout Routes */}
        <Route element={<Layout />}>
          <Route
            path="/landingPageUser/:id"
            element={
              <ProtectedRoute>
                <LandingPageUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/university"
            element={
              <ProtectedRoute>
                <UniversityIntro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/university/:exerciseId"
            element={
              <ProtectedRoute>
                <University />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bugadune"
            element={
              <ProtectedRoute>
                <Bugadune />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csscrypta"
            element={
              <ProtectedRoute>
                <CSSCrypta />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forumia"
            element={
              <ProtectedRoute>
                <Forumia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playground"
            element={
              <ProtectedRoute>
                <Playground />
              </ProtectedRoute>
            }
          />
          <Route
            path="/towerofapion"
            element={
              <ProtectedRoute>
                <TowerOfAPIon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <ProfilNav />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
