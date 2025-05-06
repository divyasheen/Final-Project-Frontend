//Pages
import LandingPage from './components/LandingPage/LandingPage'
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
//Routing
import { Route, Routes } from "react-router";
// styling Files
import './index.css'




function App() {

  return (
    <>
    <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="login" element={<LoginPage />}/>
        <Route path="register" element={<RegisterPage />}/>


      </Routes>

    </>
  )
}

export default App
