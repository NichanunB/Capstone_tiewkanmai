// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// อย่างง่าย: ถ้าไม่ได้ล็อกอิน ให้ redirect ไปหน้า signin พร้อมกับส่ง redirect URL กลับมาหลังล็อกอิน
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // รอโหลดข้อมูลผู้ใช้ให้เสร็จก่อน
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลดข้อมูล...</div>;
  }

  // ถ้าไม่ได้ล็อกอิน ให้ redirect ไปหน้า signin
  if (!user) {
    // บันทึก URL ปัจจุบันเพื่อ redirect กลับมาหลังล็อกอิน
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // ถ้าล็อกอินแล้ว แสดงเนื้อหาปกติ
  return children;
};

export default ProtectedRoute;