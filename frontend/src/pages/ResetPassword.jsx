import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
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
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3674B5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-140">
        <h2 className="text-2xl font-bold text-center">รีเซ็ตรหัสผ่าน</h2>
        <p className="text-lg text-center mb-4">กรอกรหัสผ่านใหม่</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-left mb-2">อีเมล</p>
            <input
              type="email"
              placeholder="กรอกอีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-left mb-2">รหัสผ่านใหม่</p>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านใหม่"
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
            <p className="text-sm text-left mb-2">ยืนยันรหัสผ่านใหม่</p>
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่านใหม่"
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
            รีเซ็ตรหัสผ่าน
          </button>
        </form>
        
        <div className="flex justify-center items-center mt-4">
          <Link to="/signin" className="text-sm text-blue-500 hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
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