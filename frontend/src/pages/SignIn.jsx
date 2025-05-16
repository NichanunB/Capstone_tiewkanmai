// src/pages/SignIn.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ดึง redirectUrl จาก query parameter ถ้ามี (เช่น กรณีเข้าหน้าที่ต้องล็อกอิน)
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!email || !password) {
      setMessage("กรุณากรอกอีเมลและรหัสผ่าน");
      setIsLoading(false);
      return;
    }

    try {
      // Debug logging
      console.log("Attempting login with:", { email, password: "******" });
      
      const result = await login({ email, password });
      console.log("Login result:", result);
      
      if (result.success) {
        // Redirect ไปยัง URL ที่ถูกกำหนดไว้ หรือหน้าแรก
        navigate(redirectUrl);
      } else {
        setMessage(result.message || "เข้าสู่ระบบล้มเหลว โปรดตรวจสอบข้อมูลของคุณ");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", error.response?.data);
      
      const errorMessage = 
        error.response?.data?.message || 
        (error.response?.status === 401 ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : 
        "เกิดข้อผิดพลาดในการเข้าสู่ระบบ, กรุณาลองใหม่อีกครั้ง");
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3674B5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-140">
        <h2 className="text-2xl font-bold text-center">เข้าสู่ระบบ</h2>
        <p className="text-lg text-center mb-4">ยินดีต้อนรับ!</p>
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-left mb-2">อีเมล</p>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={isLoading}
            className={`w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-[#2a5b8e] mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <div className="flex justify-center items-center mt-4">
            <p className="text-sm">ยังไม่มีบัญชีใช่ไหม?</p>
            <Link to="/signup" className="ml-1 text-sm text-blue-500 hover:underline">
                สมัครสมาชิก
            </Link>
          </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}