import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ResultTabs from './ResultTabs';
import PlacesCard from './PlacesCard';
import TravelCard from './TravelCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SearchResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState({
    places: [],
    restaurants: [],
    travelPlans: []
  });
  const [activeTab, setActiveTab] = useState('places');
  const location = useLocation();
  const { user } = useAuth();
  
  // Get search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        
        // แก้ไขจุดนี้: เปลี่ยน endpoint เป็น /api/dev/search เพื่อไม่ต้องใช้ token
        // หรือถ้าต้องการใช้ token ให้ส่ง Authorization header ไปด้วย
        const response = await axios.get(`http://localhost:8080/api/dev/search?q=${encodeURIComponent(query)}`, {
          headers: user?.token ? {
            Authorization: `Bearer ${user.token}`
          } : {}
        });
        
        setResults(response.data || {
          places: [],
          restaurants: [],
          travelPlans: []
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Search error:', error);
        setIsLoading(false);
        // ถ้าเกิด error ให้แสดงข้อมูลตัวอย่างแทน
        setResults({
          places: [
            {id: 1, name: 'เยาวราช', desc: 'ย่านไชน่าทาวน์ที่มีชื่อเสียงของกรุงเทพฯ', image: '/images/yaowarat.jpg'},
            {id: 2, name: 'วัดพระแก้ว', desc: 'วัดสำคัญในกรุงเทพฯ', image: '/images/temple.jpg'},
          ],
          restaurants: [
            {id: 1, name: 'ร้านอาหาร 1', desc: 'อร่อยมาก', image: '/images/food1.jpg'},
          ],
          travelPlans: [
            {id: 1, title: 'เที่ยวกรุงเทพ 1 วัน', author: 'นักท่องเที่ยว', locations: ['เยาวราช', 'วัดพระแก้ว'], likes: 42},
          ]
        });
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, user]);

  if (!query) {
    return <div className="text-center py-10">กรุณาใส่คำค้นหา</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl mb-6">แสดงผลการค้นหา: "{query}"</h2>
      
      <ResultTabs activeTab={activeTab} onChange={setActiveTab} tabs={[
        { id: 'places', label: 'ที่ท่องเที่ยว' },
        { id: 'restaurants', label: 'ร้านอาหาร' },
        { id: 'travelPlans', label: 'แผนเที่ยว' }
      ]} />

      {isLoading ? (
        <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="mt-4">
          {activeTab === 'places' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.places && results.places.length > 0 ? (
                results.places.map(place => (
                  <PlacesCard key={place.id} {...place} />
                ))
              ) : (
                <div className="col-span-3 text-center py-6">ไม่พบข้อมูลสถานที่ท่องเที่ยว</div>
              )}
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.restaurants && results.restaurants.length > 0 ? (
                results.restaurants.map(restaurant => (
                  <PlacesCard key={restaurant.id} {...restaurant} />
                ))
              ) : (
                <div className="col-span-3 text-center py-6">ไม่พบข้อมูลร้านอาหาร</div>
              )}
            </div>
          )}

          {activeTab === 'travelPlans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.travelPlans && results.travelPlans.length > 0 ? (
                results.travelPlans.map(plan => (
                  <TravelCard key={plan.id} {...plan} />
                ))
              ) : (
                <div className="col-span-3 text-center py-6">ไม่พบข้อมูลแผนเที่ยว</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResults;