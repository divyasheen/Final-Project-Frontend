import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import ForgetPass from "./components/ForgetPass/ForgetPass";
import SetNewPass from "./components/SetNewPass/SetNewPass";
import VerificationSuccess from "./components/VerificationSucces/VerificationSuccess";
import VerificationError from "./components/VerificationError/VerificationError";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

// Pages (Protected)
import University from "./components/University/University";
import UniversityIntro from "./components/University/University-intro";
import Bugadune from "./components/Bugadune/Bugadune";
import CSSCrypta from "./components/CSSCrypta/CSSCrypta";
import Forumia from "./components/Forumia/Forumia";
import Playground from "./components/Playground/Playground";
import TowerOfAPIon from "./components/TowerOfAPIon/TowerOfAPIon";
import ProfilNav from "./components/ProfileUser/ProfileUser";
import Chatbot from "./components/Chatbot/Chatbot";
import CreatePost from "./components/CreatePost/CreatePost";
import LandingPageUser from "./components/LandingPage-User/LandingPageUser";
import EditProfile from "./components/EditProfile";

// 👇 New dynamic community component
import CommunityPage from "./components/CommunityPage/CommunityPostPage";

// Styling
import "./App.scss";

// Layout and Routing
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { UserProvider } from "./contexts/userIdContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgetPAss" element={<ForgetPass />} />
        <Route path="/users/reset-password/:token" element={<SetNewPass />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/verification-error" element={<VerificationError />} />

        {/* Protected Routes */}
        <Route
          path="/createPost"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
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
          {/* 👇 Dynamic route for any community */}
          <Route
            path="forumia/posts/:community"
            element={
              <ProtectedRoute>
                <CommunityPage />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
