import React from "react";
import {  Routes, Route, Link } from "react-router-dom";

//Pages
import LandingPage from "./components/LandingPage/LandingPage";
import LoginPage from "./components/Login/LoginPage";
import RegisterPage from "./components/Register/RegisterPage";
import NavBar from "./components/NavBar/NavBar";
import University from "./components/University/University";
import Bugadune from "./components/Bugadune/Bugadune";
import CSSCrypta from "./components/CSSCrypta/CSSCrypta";
import Forumia from "./components/Forumia/Forumia";
import Playground from "./components/Playground/Playground";
import TowerOfAPIon from "./components/TowerOfAPIon/TowerOfAPIon";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import ProfilNav from "./components/ProfilNav/ProfilNav";
import Layout from "./components/Layout";

// styling Files
import "./App.scss";


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
       
      <Route element={<Layout />}>
        <Route path="/university" element={<University />} />
        <Route path="/bugadune" element={<Bugadune />} />
        <Route path="/csscrypta" element={<CSSCrypta />} />
        <Route path="/forumia" element={<Forumia />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/towerofapion" element={<TowerOfAPIon />} />
        <Route path="/user" element={<ProfilNav />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

export default App;
