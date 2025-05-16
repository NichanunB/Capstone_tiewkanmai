import React, { useState, useEffect } from "react";
import TitleBlock from "./TitleBlock";
import CoverImageBlock from "./CoverImageBlock";
import BlockContainer from "./BlockContainer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import planService from "../../services/planService"; // ✅ ใช้ default import


const initialBlocks = [
  { id: uuidv4(), type: "notes", data: { text: "" } },
  { id: uuidv4(), type: "places", data: { places: [] } },
  { id: uuidv4(), type: "list", data: { items: [] } },
  { id: uuidv4(), type: "budget", data: { items: [] } },
];

const blockTypes = [
  { type: "notes", label: "โน้ต" },
  { type: "places", label: "แหล่งท่องเที่ยว" },
  { type: "list", label: "รายการ" },
  { type: "budget", label: "งบประมาณ" },
];

const PlanEditor = () => {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // ตรวจสอบการล็อกอินเมื่อโหลดหน้า
    if (!user) {
      console.log("ไม่ได้ล็อกอิน");
      
      // ถ้าไม่ได้ล็อกอินและไม่ใช่โหมดพัฒนา ให้เด้งไปหน้า login
      if (import.meta.env.MODE !== 'development') {
        if (window.confirm("คุณยังไม่ได้เข้าสู่ระบบ ต้องการไปที่หน้าเข้าสู่ระบบหรือไม่?")) {
          navigate('/login?redirect=/create-plan');
          return;
        }
      }
    }
  }, [user, navigate]);

  const moveBlock = (from, to) => {
    const updated = [...blocks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setBlocks(updated);
  };

  const handleBlockChange = (idx, data) => {
    setBlocks((blocks) => {
      const updated = [...blocks];
      updated[idx] = { ...updated[idx], data };
      return updated;
    });
  };

  const addBlock = (type) => {
    // กำหนดค่าเริ่มต้นตาม type
    let initialData = {};
    switch (type) {
      case 'notes':
        initialData = { text: "" };
        break;
      case 'places':
        initialData = { places: [] };
        break;
      case 'list':
        initialData = { items: [] };
        break;
      case 'budget':
        initialData = { items: [] };
        break;
      default:
        initialData = {};
    }
    
    setBlocks((blocks) => [
      ...blocks,
      { id: uuidv4(), type, data: initialData },
    ]);
  };

  const handleSave = async () => {
    if (!title || !title.trim()) {
      setError("กรุณากรอกชื่อแผนท่องเที่ยว");
      return;
    }

    setIsSaving(true);
    setError("");

    const planData = {
      name: title.trim(),
      coverImage: coverImage || null,
      note: "",
      jsonData: JSON.stringify(blocks),
    };

    try {
      // ใช้ planService แทนการเรียก axios โดยตรง
      await planService.createPlan(planData);
      
      alert("บันทึกแผนการเดินทางเรียบร้อยแล้ว!");
      navigate("/dashboard?reload=plans");
    } catch (error) {
      console.error("❌ Save plan failed:", error.response?.data || error.message);
      
      setError("เกิดข้อผิดพลาดในการบันทึกแผน: " + (error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง"));
      
      // สำหรับการพัฒนา: ยังให้ไปหน้า dashboard แม้มี error
      if (import.meta.env.MODE === 'development') {
        if (window.confirm("เกิดข้อผิดพลาดในการบันทึก แต่จะลองไปหน้า dashboard ต่อหรือไม่?")) {
          // บันทึกข้อมูลลง localStorage เพื่อจำลองการบันทึกสำเร็จ
          const tempPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
          tempPlans.push({
            id: Date.now(),
            name: title.trim(),
            note: "",
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('tempPlans', JSON.stringify(tempPlans));
          
          navigate("/dashboard?reload=plans");
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    navigate(-1);
  };

  return (
    <div className="w-screen p-0 m-0">
      <div className="m-4 relative">
        <CoverImageBlock imageUrl={coverImage} onChange={setCoverImage} />
        <TitleBlock title={title} onChange={setTitle} />
        <BlockContainer
          blocks={blocks}
          moveBlock={moveBlock}
          onBlockChange={handleBlockChange}
        />
        
        {/* แสดงข้อความ error */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-end">
          <div className="flex gap-2 flex-wrap">
            {blockTypes.map((bt) => (
              <button
                key={bt.type}
                className="px-4 py-2 text-white rounded-lg bg-[#3674b5] hover:bg-[#2a5b8e]"
                onClick={() => addBlock(bt.type)}
                type="button"
              >
                + {bt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow"
              onClick={handleDiscard}
              type="button"
              disabled={isSaving}
            >
              ยกเลิก
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg ${isSaving ? 'bg-gray-500' : 'bg-[#3674b5] hover:bg-[#2a5b8e]'} shadow`}
              onClick={handleSave}
              type="button"
              disabled={isSaving}
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanEditor;