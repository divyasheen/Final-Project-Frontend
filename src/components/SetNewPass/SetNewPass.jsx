import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SetNewPass = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams(); // from URL: /reset-password/:token

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
      const res = await fetch(`http://localhost:5000/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password successfully updated. You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrors(data.errors || [{ msg: data.error }]);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors([{ msg: 'Something went wrong. Please try again.' }]);
    }
  };

  return (
    <section className="bg-background min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-xl shadow-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <h2 className="text-2xl font-vt323 text-white tracking-wider text-center mb-8">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="font-vt323 text-white text-sm md:text-lg block mb-1">
              New Password:
            </label>
            <input
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your new password"
              required
              className="w-full px-4 py-2 border-b text-white bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary font-vt323 md:text-xl py-2 rounded-md hover:bg-opacity-90 transition"
          >
            Set New Password
          </button>

          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}

          {errors &&
            errors.map((err, i) => (
              <p key={i} className="text-[13px] text-red-500 mt-1">
                {err.msg}
              </p>
            ))}
        </form>

        <div className="text-white text-center mt-6 text-sm">
          Back to{" "}
          <span
            className="text-accent hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            login
          </span>
        </div>
      </div>
    </section>
  );
};

export default SetNewPass;
