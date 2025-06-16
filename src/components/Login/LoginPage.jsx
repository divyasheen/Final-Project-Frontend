import React, { useState, useEffect, useContext } from "react";
import { FaUserCircle, FaGoogle, FaGithub } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userIdContext";

const LoginPage = () => {
  const navigateTo = useNavigate();
  const { setUserId, setToken, setUser } = useContext(UserContext);

  const [errors, setErrors] = useState(null);
  const [userForm, setUserform] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleInput = (e) => {
    setUserform((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userForm),
      });

      const data = await res.json();

      if (res.ok) {
        setUserId(data.id); // assuming data.id is the user ID
        setToken(data.token); // assuming backend sends JWT or session token
        setUser(data.user); // full user object if available
        // Save token & userId to localStorage here
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        navigateTo(`/landingPageUser/${data.id}`);
      } else {
        setErrors(data.errors || [{ msg: data.error }]);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential;

      const res = await fetch("http://localhost:5000/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: idToken }),
      });

      console.log("Raw response:", res);
      const data = await res.json();
      console.log("Parsed data:", data);

      if (res.ok && data.user && data.user.id) {
        // Verify token format before storing
        if (!data.token || typeof data.token !== 'string') {
          console.error('Invalid token received from server:', data.token);
          setErrors([{ msg: "Login failed: Invalid token received" }]);
          return;
        }

        // Log the token parts for debugging
        const tokenParts = data.token.split('.');
        console.log('Token parts:', {
          header: tokenParts[0],
          payload: tokenParts[1],
          signature: tokenParts[2],
          totalParts: tokenParts.length
        });

        if (tokenParts.length !== 3) {
          console.error('Invalid token format received from server');
          setErrors([{ msg: "Login failed: Invalid token format" }]);
          return;
        }

        // Store token first
        localStorage.setItem("token", data.token);
        
        // Verify token was stored correctly
        const storedToken = localStorage.getItem("token");
        console.log('Token storage verification:', {
          original: data.token,
          stored: storedToken,
          match: data.token === storedToken
        });

        if (storedToken !== data.token) {
          console.error('Token storage failed');
          setErrors([{ msg: "Login failed: Token storage error" }]);
          return;
        }

        // Then update other state
        setUserId(data.user.id);
        setToken(data.token);
        setUser(data.user);
        
        // Store other data
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Verify all data was stored
        console.log('Final storage state:', {
          token: localStorage.getItem("token"),
          userId: localStorage.getItem("userId"),
          user: localStorage.getItem("user")
        });

        // Add a small delay before navigation
        setTimeout(() => {
          console.log("Navigating to:", `/landingPageUser/${data.user.id}/${storedToken}`);
          navigateTo(`/landingPageUser/${data.user.id}/${storedToken}`);
        }, 100);
      } else {
        console.error("Login response missing required data:", data);
        setErrors([{ msg: "Login failed. Please try again." }]);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setErrors([{ msg: "Google login failed. Please try again." }]);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
      client_id: "597088642216-rdog1tvplk26p1jjaf0r572c3i48cp3c.apps.googleusercontent.com",
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      ux_mode: 'popup',  
      origin: window.location.origin 
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        {
          theme: "outline",
          size: "large",
        }
      );
    } else {
      console.warn("Google API not available yet.");
    }
  }, []);

  return (
    <section className="bg-background min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-xl shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="flex justify-center mb-6">
          <FaUserCircle className="text-6xl text-accent" />
        </div>
        <h2 className="text-2xl font-vt323 text-white tracking-wider text-center mb-14">
          Login to Your Account
        </h2>
        <form
          id="loginForm"
          className="flex flex-col md:gap-9 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="font-vt323 text-white text-sm md:text-lg block mb-1"
            >
              Email:
            </label>
            <input
              name="email"
              id="email"
              type="email"
              onChange={handleInput}
              value={userForm.email}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-2 border-b text-white bg-transparent focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="font-vt323 text-white text-sm md:text-lg block mb-1"
            >
              Password:
            </label>
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={handleInput}
              value={userForm.password}
              placeholder="••••••••"
              autoComplete="off"
              className="w-full px-4 py-2 border-b text-white bg-transparent focus:outline-none"
            />
            <div className="text-white text-xs mt-4 flex flex-col sm:flex-row justify-between gap-3">
              <label className="flex items-center">
                <input
                  onChange={() => setShowPassword(!showPassword)}
                  type="checkbox"
                  className="mr-2"
                />
                Show Password
              </label>
              <NavLink to="/forgetPass" className="hover:underline">
                Forgot Password?
              </NavLink>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-secondary font-vt323 md:text-2xl py-2 rounded-md hover:bg-opacity-90 transition"
            >
              LogIn
            </button>
            {errors &&
              errors.map((err, i) => (
                <p key={i} className="text-[13px] text-red-500 mt-1">
                  {err.msg}
                </p>
              ))}
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-white/30" />
            <span className="mx-4 text-white text-sm font-vt323">
              or login with
            </span>
            <hr className="flex-grow border-t border-white/30" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div id="googleButton"></div>
            {/* <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-white text-white rounded-md hover:bg-white/10 transition"
            >
              <FaGithub />
              <span className="font-vt323 text-sm md:text-base">GitHub</span>
            </button> */}
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
