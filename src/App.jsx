import React from "react";
import { Routes, Route, Link } from "react-router-dom";

//Pages
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
import JavaScript from "./components/JavaScriptCommunityPosts/JavaScript";
import Rules from "./components/RulesCommunityPosts/Rules"
import Css from "./components/CssCommunityPosts/Css"
import GeneralDiscussions from "./components/GeneralCommunityPosts/GeneralDiscussions"
import OffTobic from "./components/OffTopicCommunityPosts/OffTopic"
import HTML from"./components/HtmlCommunityPosts/Html"
import HelloWorld from "./components/HelloWorldCommunityPosts/HelloWorld";
import EditProfile from "./components/EditProfile/EditProfile";

// styling Files
import "./App.scss";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <>
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
              path="/landingPageUser/:id/:token"
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
              path="forumia/posts/JavaScript"
              element={
                <ProtectedRoute>
                  <JavaScript />
                </ProtectedRoute>
              }
            />
            <Route
              path="forumia/posts/Css"
              element={
                <ProtectedRoute>
                  <Css />
                </ProtectedRoute>
              }
            />
            <Route
              path="forumia/posts/General-Discussions"
              element={
                <ProtectedRoute>
                  <GeneralDiscussions />
                </ProtectedRoute>
              }
            />
            <Route
              path="forumia/posts/Off-Topic"
              element={
                <ProtectedRoute>
                  <OffTobic />
                </ProtectedRoute>
              }
            />
            <Route
              path="forumia/posts/HTML"
              element={
                <ProtectedRoute>
                  <HTML />
                </ProtectedRoute>
              }
            />
            <Route
              path="forumia/posts/Hello-World"
              element={
                <ProtectedRoute>
                  <HelloWorld />
                </ProtectedRoute>
              }
            />
            <Route
              path="forumia/posts/Rules"
              element={
                <ProtectedRoute>
                  <Rules />
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
              path="/profile/:id"
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
    </>
  );
}

export default App;