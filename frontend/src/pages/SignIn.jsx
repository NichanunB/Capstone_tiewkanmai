import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function SignIn() {
  const [email, setEmail] = useState(""); // เปลี่ยนจาก username เป็น email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token); // ✅ เก็บ JWT
      setMessage("Login successful!");
      setTimeout(() => navigate("/"), 1000); // เปลี่ยนเส้นทางหลัง login
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3674B5]">
      <div className="bg-white p-8 rounded-lg shadow-md w-140">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <p className="text-lg text-center mb-4">Welcome Back!</p>
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-left mb-2">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm">Password</p>
            <Link to="/reset-password" className="text-sm text-blue-500 hover:underline">
              Forget Password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#3674B5] text-white py-2 rounded-lg hover:bg-[#2a5b8e] mt-4"
          >
            Sign In
          </button>
        </form>
        <div className="flex justify-center items-center mt-4">
          <p className="text-sm">Don't have an account?</p>
          <Link to="/signup" className="text-sm text-blue-500 hover:underline ml-1">
            Sign Up
          </Link>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
