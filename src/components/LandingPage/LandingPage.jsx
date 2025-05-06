import React from "react";
import Frame3 from "../../assets/images/Frame3.png";
import { NavLink } from "react-router-dom";
const LandingPage = () => {
  return (
    <section className="bg-background min-h-screen flex flex-col">
      <div className=" border-2 border-accent p-6 sm:p-8 md:p-12 lg:p-40 flex flex-col justify-evenly items-center w-[90%] sm:w-11/12 md:w-4/5 gap-8 m-auto rounded-xl shadow-lg">
        <h1 className=" font-vt323 text-white text-lg sm:text-xl tracking-[.1em]">Welcome to</h1>

        <img className="w-full max-w-xs sm:max-w-sm md:max-w-md" src={Frame3} alt="App Preview" />

        <p className="  font-vt323 text-justify leading-loose text-white text-sm sm:text-base max-w-2-xl tracking-[.05em]
">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum.
        </p>

        <h2 className="text-white text-base sm:text-lg font-semibold">Get started</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <NavLink to='login'>
            <button className=" w-full bg-accent text-black px-4 py-2 rounded hover:bg-accentHover transition">
              Login
            </button>
          </NavLink>
          <NavLink to='register'>
            <button className="bg-accent text-black px-4 py-2 rounded hover:bg-accentHover transition">
              Register
            </button>
          </NavLink>
        </div>
      </div>

      <footer className="bg-footer py-4 text-center">
        <p className="text-white text-sm">Impressum</p>
      </footer>
    </section>
  );
};

export default LandingPage;
