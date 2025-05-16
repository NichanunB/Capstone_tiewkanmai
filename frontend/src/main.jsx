import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 👈 import มาเพิ่ม

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 👈 ครอบ App */}
      <App />
    </AuthProvider>
  </StrictMode>
);
