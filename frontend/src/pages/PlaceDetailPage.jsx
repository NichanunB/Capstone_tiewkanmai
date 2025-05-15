import React from 'react';
import Navbar from '../components/Navbar';
import PlaceDetail from '../components/PlaceDetail';
import RecommendedPlaces from '../components/RecommendedPlaces';
import Footer from '../components/Footer';

const templeDescription = `วัดมังกรกมลาวาส หรือ วัดเล่งเน่ยยี่ เยาวราช เป็นวัดในสังกัดคณะสงฆ์จีนนิกายแห่งประเทศไทย ก่อตั้งขึ้นเมื่อปี พ.ศ. 2414 บนถนนเจริญกรุง ระหว่างซอยเจริญกรุง 19 และ 21 โดยวัดมีลักษณะสถาปัตยกรรมเป็นแบบทางจีนตอนใต้ของสกุลช่างแต้จิ๋ว โดยวางแปลนตามแบบ วัดหลวง คือ มี วิหารท้าวจตุโลกบาล เป็นวิหารแรก ตรงกลางเป็นพระอุโบสถ ข้างหลังพระอุโบสถเป็นวิหารเทพเจ้า เป็นวัดที่มีศิลปะงดงาม`;

const recommendedPlaces = [
  {
    id: 1,
    title: 'ดอยอ่างขาง',
    imageUrl: 'https://images.unsplash.com/photo-1580181540753-3ffc51ddbb2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'เชียงใหม่',
    rating: 4,
    tags: ['ดอย']
  },
  {
    id: 2,
    title: 'คลองบางหลวง',
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'กรุงเทพ',
    rating: 4.5,
    tags: ['คลอง', 'ล่องเรือ', 'ตลาด']
  },
  {
    id: 3,
    title: 'ตลาดน้ำตลาด',
    imageUrl: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: 'กรุงเทพ',
    rating: 4,
    tags: ['ที่เที่ยวกลางคืน']
  }
];

const PlaceDetailPage = () => {
  return (
    <div className="min-h-screen bg-[#E7F9FF] flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-grow flex items-center">
        <div className="bg-white rounded-lg shadow-lg w-full p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PlaceDetail
                title="วัดเล่งเน่ยยี่"
                address="423 ถ. เจริญกรุง แขวงป้อมปราบ เขตป้อมปราบศัตรูพ่าย กรุงเทพมหานคร 10100"
                rating={4.7}
                tags={['วัด', 'สถาปัตยกรรมศาลเจ้า', 'บูชา', 'แห่เจ้า']}
                description={templeDescription}
                imageUrl="https://images.unsplash.com/photo-1528159936662-d5c754040bbb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              />
            </div>
            <div>
              <RecommendedPlaces places={recommendedPlaces} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlaceDetailPage;
