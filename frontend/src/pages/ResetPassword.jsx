import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Password validation (minimum 8 characters with at least one number)
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage("Password must be at least 8 characters and contain at least one number");
      return;
    }

    // Dummy success (replace with actual API call later)
    setMessage("Password reset successful!");
    // Reset form fields
    setNewPassword("");
    setConfirmPassword("");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3674B5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-140">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-lg text-center mb-4">Create a new password</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-left mb-2">New Password</p>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {/* <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters and contain at least one number
            </p> */}
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-left mb-2">Confirm Password</p>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-[#2a5b8e] mt-4"
          >
            Reset Password
          </button>
        </form>
        
        <div className="flex justify-center items-center mt-4">
          <Link to="/signin" className="text-sm text-blue-500 hover:underline">
            Back to Sign In
          </Link>
        </div>
        
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}