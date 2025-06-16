import React, { useState } from "react";

const VerificationError = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/users/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus({ type: "success", message: data.message });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <section className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="p-8 rounded-xl shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <h2 className="text-2xl font-vt323 text-red-600 tracking-wider text-center mb-6">
          Verification Failed
        </h2>
        <p className="text-white text-xl md:text-2xl font-vt323 text-center mb-8">
          The verification link is invalid or has expired. Please request a new one.
        </p>

        <form
          onSubmit={handleResend}
          className="flex flex-col gap-6 font-vt323"
        >
          <div>
            <label htmlFor="email" className="text-white text-sm md:text-lg block mb-1">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xl px-4 py-2 border-b text-white bg-transparent focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary font-vt323 md:text-2xl py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Resend Confirmation Email
          </button>

          {status && (
            <p className={`text-sm mt-2 text-center ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default VerificationError;
