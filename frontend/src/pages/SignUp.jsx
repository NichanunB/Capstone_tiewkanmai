// src/pages/SignUp.jsx
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // รูปแบบอีเมลที่ถูกต้อง (basic validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    if (!validatePassword(password)) {
      setMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        firstName,
        lastName,
        email,
        password
      });

      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message || "สมัครสมาชิกสำเร็จ กำลังนำคุณไปยังหน้าเข้าสู่ระบบ");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3674B5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-140">
        <h2 className="text-2xl font-bold text-center">สมัครสมาชิก</h2>
        <p className="text-lg text-center mb-4">ยินดีต้อนรับ! มาเริ่มท่องเที่ยวกันเถอะ</p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <p className="text-sm text-left mb-2">ชื่อ</p>
              <input
                type="text"
                placeholder="ชื่อ"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="w-1/2">
              <p className="text-sm text-left mb-2">นามสกุล</p>
              <input
                type="text"
                placeholder="นามสกุล"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <p className="text-sm text-left mb-2">อีเมล</p>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <p className="text-sm text-left mb-2">รหัสผ่าน</p>
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <p className="text-sm text-left mb-2">ยืนยันรหัสผ่าน</p>
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-[#2a5b8e] mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
          </button>
        </form>
        <div className="flex justify-center items-center mt-4 gap-1">
          <p className="text-sm">มีบัญชีแล้วใช่ไหม?</p>
          <Link to="/signin" className="text-sm text-blue-500 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </div>
        {message && (
          <p className={`mt-4 text-center text-sm ${isSuccess ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}