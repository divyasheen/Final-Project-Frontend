import React from "react";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import {  useNavigate } from 'react-router-dom'







const RegisterPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword,setShowPassword]=useState(false)


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
       
       
      if (res.ok) {
        setSuccess("Registration successful! Please check your email to verify your account");
        setTimeout(() => {
          
           navigate('/login')
        }, 3000);
      } else {
        setErrors(data.errors || [{ msg: data.error }]);
      }
    } catch (err) {
      setErrors([err||{ msg: "Server error. Please try again later." }]);
    }
  };

  return (
    <section className="bg-background min-h-screen flex  items-center justify-center">
      <div className="p-8 rounded-xl shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="flex justify-center mb-6">
          <FaUserCircle className=" text-6xl text-accent  " />
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-white/30" />
          <span className="mx-4 text-white text-sm md:text-2xl font-vt323">
            Register
          </span>
          <hr className="flex-grow border-t border-white/30" />
        </div>

        <form
          className=" flex flex-col md:gap-9 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className=" font-vt323  text-white  block text-sm  md:text-lg font-medium mb-1"
              htmlFor="username"
            >
              Username:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full px-4 py-2 border-b  text-sm  md:text-lg  text-white focus:outline-none bg-transparent"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className=" font-vt323  text-white  block text-sm  md:text-lg font-medium mb-1"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border-b  text-sm  md:text-lg  text-white focus:outline-none bg-transparent"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              id="password"
              name="password"
              type={showPassword?'text':'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full border-b  px-4 py-2 text-white   focus:outline-none f bg-transparent"
              placeholder="••••••••"
              autoComplete="off"
              required
            />
              <div className="text-white text-xs mt-4 flex flex-col sm:flex-row justify-between gap-3">
              <label className="flex items-center">
                <input onChange={()=>setShowPassword(!showPassword)} type="checkbox" className="mr-2" />Show Password
              </label>
           
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary font-vt323 md:text-2xl    py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Register Now
          </button>

          {errors && (
            <div className="mt-4 text-red-500 text-sm">
              {errors.map((err, i) => (
                <div key={i}>{err.msg}</div>
              ))}
            </div>
          )}

          {success && <div className="mt-4 text-green-400 text-sm">{success}</div>}
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;
