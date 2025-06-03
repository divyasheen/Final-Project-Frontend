import React from "react";
import { Routes, Route, Link } from "react-router-dom";

//Pages
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import NavBar from "./components/NavBar/NavBar";
import University from "./components/University/University";
import UniversityIntro from "./components/University/University-intro";
import Bugadune from "./components/Bugadune/Bugadune";
import CSSCrypta from "./components/CSSCrypta/CSSCrypta";
import Forumia from "./components/Forumia/Forumia";
import Playground from "./components/Playground/Playground";
import TowerOfAPIon from "./components/TowerOfAPIon/TowerOfAPIon";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import ProfilNav from "./components/ProfilNav/ProfilNav";
import Layout from "./components/Layout";
import ForgetPass from "./components/ForgetPass/ForgetPass";
import Chatbot from "./components/Chatbot/Chatbot"
import Logout from "./components/logout/Logout.jsx";
import LandingPageUser from "./components/LandingPage-User/LandingPageUser";
import VerificationSuccess from "./components/VerificationSucces/VerificationSuccess";
import VerificationError from "./components/VerificationError/VerificationError";
import SetNewPass from "./components/SetNewPass/SetNewPass";
// styling Files
import "./App.scss";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgetPAss" element ={<ForgetPass />}/>
        <Route path="/users/reset-password/:token" element={<SetNewPass />} />
        <Route path="/verification-success" element={<VerificationSuccess />}/>
        <Route path="/verification-error" element={<VerificationError />}/>
        <Route element={<Layout />}>
          <Route path="/landingPageUser/:id" element={
            <ProtectedRoute><LandingPageUser /></ProtectedRoute>} />
          <Route path="/university" element={
            <ProtectedRoute><UniversityIntro /></ProtectedRoute>} />
          <Route path="/university/:exerciseId" element={
             <ProtectedRoute><University /></ProtectedRoute>} />
          <Route path="/bugadune" element={
             <ProtectedRoute><Bugadune /></ProtectedRoute>} />
          <Route path="/csscrypta" element={
             <ProtectedRoute><CSSCrypta /></ProtectedRoute>} />
          <Route path="/forumia" element={
             <ProtectedRoute><Forumia /></ProtectedRoute>} />
          <Route path="/playground" element={
             <ProtectedRoute><Playground /></ProtectedRoute>} />
          <Route path="/towerofapion" element={
             <ProtectedRoute><TowerOfAPIon /></ProtectedRoute>} />
          <Route path="/user" element={
             <ProtectedRoute><ProfilNav /></ProtectedRoute>} />
          <Route path="/chatbot" element={
             <ProtectedRoute><Chatbot /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
