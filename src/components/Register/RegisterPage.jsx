import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaGoogle, FaGithub } from "react-icons/fa";


const LoginPage = () => {
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
        <form className=" flex flex-col md:gap-9 space-y-4">
            
        <div>
            
            <label
              className=" font-vt323  text-white  block text-sm  md:text-lg font-medium mb-1"
              htmlFor="Name"
            >
             User Name:
            </label>
            <input
             
              id="Name"
              type='text'
              className="w-full px-4 py-2 border-b  text-sm  md:text-lg  text-white focus:outline-none bg-transparent"
              placeholder=" Name"
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
              type="password"
              className="w-full border-b  px-4 py-2 text-white   focus:outline-none f bg-transparent"
              placeholder="••••••••"
              autoComplete="off"
            />
            
          </div>

          <button
            type="submit"
            className="w-full bg-accent font-vt323 md:text-2xl    py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Register Now
          </button>

        

  
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
