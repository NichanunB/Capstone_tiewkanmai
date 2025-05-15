import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const travelPlan = {
  id: 1,
  title: "KhawFang PaTiew Bangkok",
  coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  user: {
    name: "Nong KhawFang",
    avatar: null, // Use null for default icon
    created: "5/2/2025"
  },
  likes: 980,
  summary: [
    {
      icon: "🙏",
      text: "เช้า: เริ่มต้นด้วยการไหว้พระที่ วัดเล่งเน่ยยี่ ขอพรเสริมดวง เสร็จไปตลาด และแวะคาเฟ่เพื่อความเป็นสิริมงคล ก่อนเดินชมสถาปัตยกรรมจีนที่งดงามและถ่ายรูปกับบรรยากาศ"
    },
    {
      icon: "🛍️",
      text: "สาย: เดินเล่นตลาดเก่า หาของอร่อยกิน เช่น โจ๊กหมู ติ่มซำ หรือขนมจีบ จากร้านเก่า ลองเมนูจิบๆต่างๆจากร้านเก่าแก่ในฝั่ง"
    },
    {
      icon: "📸",
      text: "บ่าย: เดินชิล ตลาดสำเพ็ง หรือ พาหุรัด แหล่งขายของราคาถูก ตั้งแต่ผ้า เครื่องประดับ ไปจนถึงของฝากเก่าๆ หรือจะแวะ ชั่งทองดูทองก็ได้"
    },
    {
      icon: "🍜",
      text: "เย็น: กลับมาทานอาหารอร่อยๆ ลิ้มรสสตรีทฟู้ดในย่านเยาวราช เช่น ก๋วยจั๊บ ข้าวหมูแดง หูฉลาม หรือบะหมี่เป็ดย่าง"
    },
    {
      icon: "🎉",
      text: "พิเศษ: ถ้ามีเวลา ลองเดินไปถึงแยก 1919 หรือ ริมแม่น้ำเจ้าพระยา ชมบรรยากาศยามค่ำคืน ปิดทริปด้วยบรรยากาศสุดคลาสสิค!"
    },
    {
      icon: "💸",
      text: "ทริปนี้ 1000 บาทเท่านั้นอยู่!"
    }
  ],
  places: [
    {
      id: 1,
      name: "วัดเล่งเน่ยยี่",
      desc: "วัดเล่งเน่ยยี่ หรือวัดมังกรกมลาวาส เป็นวัดจีนเก่าแก่ในกรุงเทพ มีสถาปัตยกรรมแบบจีนแท้ๆ เหมาะสำหรับการไหว้พระขอพรเสริมดวงและถ่ายรูปกับบรรยากาศจีนโบราณ",
      image: "https://images.unsplash.com/photo-1528159936662-d5c754040bbb?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "เยาวราช",
      desc: "เยาวราชคือย่านไชน่าทาวน์ของกรุงเทพฯ มีชื่อเสียงด้านอาหารอร่อยและวัฒนธรรมจีนที่เข้มข้น บรรยากาศคึกคักเต็มไปด้วยร้านอาหารข้างทางมากมาย และของขายต่างๆ เปิดถึง และรสชาติแบบต้นตำรับ",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=60"
    },
    {
      id: 3,
      name: "ตลาดสำเพ็ง",
      desc: "ตลาดสำเพ็งเป็นแหล่งค้าส่งและค้าปลีกสินค้าราคาถูกที่มีชื่อเสียงในกรุงเทพฯ ซึ่งอยู่ใกล้ย่านเยาวราช เหมาะสำหรับการเดินเล่นและหาซื้อของฝาก ของใช้ต่างๆ ในราคาย่อมเยา โดยเฉพาะช่วงกลางคืน",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=60"
    },
    {
      id: 4,
      name: "เยาวราช",
      desc: "เยาวราชคือย่านไชน่าทาวน์ของกรุงเทพฯ มีชื่อเสียงด้านอาหารอร่อยและวัฒนธรรมจีนที่เข้มข้น บรรยากาศคึกคักเต็มไปด้วยร้านอาหารข้างทางมากมาย และของขายต่างๆ เปิดถึง และรสชาติแบบต้นตำรับ",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=60"
    }
  ],
  budget: {
    total: 1000,
    details: [
      { label: "อาหาร", amount: 700 },
      { label: "เดินทาง", amount: 300 }
    ]
  }
};

export default function TripDetailPage() {
  return (
    <div className="min-h-screen bg-[#E7F9FF] flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <img
            src={travelPlan.coverImage}
            alt={travelPlan.title}
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Link to={`/travel-plan/${travelPlan.id}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{travelPlan.title}</h1>
            </Link>
          </div>
          {/* User Info and Like */}
          <div className="absolute left-0 bottom-0 w-full flex justify-between items-center px-6 py-4 bg-gradient-to-t from-black/40 to-transparent">
            <div className="flex items-center gap-3">
              {travelPlan.user.avatar ? (
                <img src={travelPlan.user.avatar} alt={travelPlan.user.name} className="w-10 h-10 rounded-full border-2 border-white" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#E7F9FF] flex items-center justify-center">
                  <User className="w-7 h-7 text-gray-500" />
                </div>
              )}
              <div>
                <div className="font-medium text-white">{travelPlan.user.name}</div>
                <div className="text-xs text-white/80">สร้างเมื่อ : {travelPlan.user.created}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              <span className="text-white font-bold text-lg">{travelPlan.likes}</span>
            </div>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#3674B5]">แผนเที่ยวของฉัน</h2>
          <ul className="mb-4 space-y-2">
            {travelPlan.summary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* My Plan Places */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#3674B5]">สถานที่เที่ยวของฉัน</h2>
          <div className="space-y-6">
            {travelPlan.places.map((place, idx) => (
              <div key={place.id} className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-500">{idx + 1}</span>
                  <Link to={`/place/${place.id}`}>
                    <span className="font-bold text-gray-700 cursor-pointer hover:underline">{place.name}</span>
                  </Link>
                </div>
                <div className="flex-1 text-gray-600">{place.desc}</div>
                <div className="flex flex-col items-end gap-2">
                  <button className="bg-red-400 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    save <Heart className="w-4 h-4 fill-white" />
                  </button>
                  <img src={place.image} alt={place.name} className="w-32 h-20 object-cover rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#3674B5]">งบประมาณ</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="bg-gray-100 rounded-lg p-6 flex-1 max-w-xs">
              <div className="text-3xl font-bold text-gray-800 mb-2">{travelPlan.budget.total.toLocaleString()} THB</div>
              <div className="text-gray-500">อาหาร : {travelPlan.budget.details[0].amount} THB</div>
              <div className="text-gray-500">เดินทาง : {travelPlan.budget.details[1].amount} THB</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
