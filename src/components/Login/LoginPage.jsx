import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useState } from "react";
import {useNavigate} from 'react-router-dom'


const LoginPage = () => {


  const navigateTo=useNavigate()

  const [errors, setErrors] = useState(null);
  
  const [userForm, setUserform] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUserform((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(userForm),
      });

      const data = await res.json();
     console.log(data);
     
      if (res.ok) {
       
      
      navigateTo(`/landingPageUser/${data.id}`)
      
      } else {
        setErrors(data.errors || [{ msg: data.error }]);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-background min-h-screen flex  items-center justify-center">
      <div className="p-8 rounded-xl shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="flex justify-center mb-6">
          <FaUserCircle className=" text-6xl text-accent  " />
        </div>
        <h2 className="text-2xl font-vt323 text-white tracking-wider  text-center mb-14">
          Login to Your Account
        </h2>
        <form
          className=" flex flex-col md:gap-9 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className=" font-vt323  text-white  block text-sm  md:text-lg font-medium mb-1"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              name="email"
              onChange={handleInput}
              value={userForm.email}
              id="email"
              type="email"
              className="w-full px-4 py-2 border-b  text-sm  md:text-lg  text-white focus:outline-none bg-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              className=" font-vt323 text-sm  md:text-lg  text-white  block font-large mb-1"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              name="password"
              onChange={handleInput}
              value={userForm.password}
              id="password"
              type="password"
              className="w-full border-b  px-4 py-2 text-white   focus:outline-none f bg-transparent"
              placeholder="••••••••"
              autoComplete="off"
            />
            <div className="text-white flex flex-col gap-3 sm:flex-row items-center mt-4  md:mt-4 justify-between text-xs ">
              <label className="flex  items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-white hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>
          <div>
          <button
            type="submit"
            className="w-full bg-accent font-vt323 md:text-2xl    py-2 rounded-md hover:bg-opacity-90 transition"
          >
            LogIn
          </button>
          {errors && errors.map((err,i)=>{
            return <p key={i} className="text-[13px] text-red-500">{err.msg}</p>
          })}
          </div>
          
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-white/30" />
            <span className="mx-4 text-white text-sm font-vt323">
              or login with
            </span>
            <hr className="flex-grow border-t border-white/30" />
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-white text-white rounded-md hover:bg-white/10 transition"
            >
              <FaGoogle className="text-red-500" />
              <span className="font-vt323 text-sm md:text-base">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-white text-white rounded-md hover:bg-white/10 transition"
            >
              <FaGithub />

              <span className="font-vt323 text-sm md:text-base">GitHub</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
