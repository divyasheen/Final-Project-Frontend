import React from 'react';
import { NavLink } from 'react-router-dom';

const VerificationSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-700">
      <h1 className="text-3xl font-bold mb-2">Email Verified!</h1>
      <p className="text-lg mb-4">Your email has been successfully verified. You can now log in.</p>
      <NavLink
       to="/login"
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go to Login
      </NavLink>
    </div>
  );
};

export default VerificationSuccess;
