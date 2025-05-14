import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaceDetail from './components/PlaceDetail';
import PlaceList from './components/PlaceList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* เส้นทางที่ใช้ไฟล์ที่มีจริง */}
        <Route path="/" element={<PlaceList />} />
        <Route path="/places" element={<PlaceList />} />
        <Route path="/places/detail/:id" element={<PlaceDetail />} />

        {/* ถ้าต้องการ future pages ค่อยเพิ่มทีหลัง เช่น:
            <Route path="/search" element={<SearchPlacesPage />} />
        */}
        
        {/* Optional: fallback สำหรับ path ที่ไม่เจอ */}
        <Route path="*" element={<div className="p-4">404 - ไม่พบหน้า</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
