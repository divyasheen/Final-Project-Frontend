import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        setErrors(data.errors || [{ msg: data.error }]);
      }
    } catch (error) {
      
      setErrors(error || { msg: "Something went wrong. Please try again later." });
    }
  };

  return (
    <section className="bg-background min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-xl shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <h2 className="text-2xl font-vt323 text-white tracking-wider text-center mb-8">
          Forgot Your Password?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="font-vt323 text-white text-sm md:text-lg block mb-1">
              Enter your email:
            </label>
            <input
              name="email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border-b text-white bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent font-vt323 md:text-xl py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Send Reset Link
          </button>

          {message && (
            <p className="text-green-500 text-sm mt-2">{message}</p>
          )}

          {errors &&
            errors.map((err, i) => (
              <p key={i} className="text-[13px] text-red-500 mt-1">
                {err.msg}
              </p>
            ))}
        </form>

        <div className="text-white text-center mt-6 text-sm">
          Remembered your password?{" "}
          <span
            className="text-accent hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to login
          </span>
        </div>
      </div>
    </section>
  );
};

export default ForgetPass;
