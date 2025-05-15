import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy check (replace this with real API/auth later)
    if (username === "user" && password === "1234") {
      login({ username, name: "Test User" }); // Add more user data as needed
      setMessage("Login successful!");
      navigate(-1);
    } else {
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3674B5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-140">
        <h2 className="text-2xl font-bold text-center">เข้าสู่ระบบ</h2>
        <p className="text-lg text-center mb-4">ยินดีต้อนรับ!</p>
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-left mb-2">อีเมลหรือชื่อผู้ใช้</p>
          <input
            type="text"
            placeholder="อีเมลหรือชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm">รหัสผ่าน</p>
            <Link to="/reset-password" className="text-sm text-blue-500 hover:underline">
                ลืมรหัสผ่าน?
            </Link>
          </div>
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-[#2a5b8e] mt-4"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <div className="flex justify-center items-center mt-4">
            <p className="text-sm">ยังไม่มีบัญชีใช่ไหม?</p>
            <Link to="/signup" className="text-sm text-blue-500 hover:underline">
                สมัครสมาชิก
            </Link>
          </div>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
