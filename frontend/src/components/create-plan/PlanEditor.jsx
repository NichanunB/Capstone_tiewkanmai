import React, { useState, useEffect } from "react";
import TitleBlock from "./TitleBlock";
import CoverImageBlock from "./CoverImageBlock";
import BlockContainer from "./BlockContainer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import services from "../../services/api"; // ✅ ใช้ default export
const { planService } = services;

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
    if (!user && import.meta.env.MODE !== 'development') {
      if (window.confirm("คุณยังไม่ได้เข้าสู่ระบบ ต้องการไปที่หน้าเข้าสู่ระบบหรือไม่?")) {
        navigate('/login?redirect=/create-plan');
        return;
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
    setBlocks((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], data };
      return updated;
    });
  };

  const addBlock = (type) => {
    let initialData = {};
    switch (type) {
      case "notes":
        initialData = { text: "" };
        break;
      case "places":
        initialData = { places: [] };
        break;
      case "list":
        initialData = { items: [] };
        break;
      case "budget":
        initialData = { items: [] };
        break;
      default:
        initialData = {};
    }

    setBlocks((prev) => [
      ...prev,
      { id: uuidv4(), type, data: initialData },
    ]);
  };

  const handleSave = async () => {
    if (!title || !title.trim()) {
      setError("กรุณากรอกชื่อแผนท่องเที่ยว");
      setIsSaving(false);
      return;
    }

    if (!blocks || blocks.length === 0) {
      setError("กรุณาเพิ่มอย่างน้อย 1 block");
      setIsSaving(false);
      return;
    }

    setIsSaving(true);
    setError("");

    const planDataForApi = {
      title: title.trim(),
      coverImage: coverImage || null,
      note: "",
      jsonData: blocks, // ✅ ส่งแบบ object
    };

    console.log("กำลังส่งข้อมูลไป backend:", planDataForApi);

    try {
      const userPlans = JSON.parse(localStorage.getItem('tempPlans') || '[]');
      const planDataForLocal = {
        id: Date.now(),
        title: title.trim(),
        coverImage: coverImage || null,
        note: "",
        jsonData: blocks,
        createdAt: new Date().toISOString(),
        author: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'ผู้ใช้',
        likes: 0
      };
      userPlans.push(planDataForLocal);

      try {
        localStorage.setItem('tempPlans', JSON.stringify(userPlans));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          setError("พื้นที่การเก็บข้อมูลแผนชั่วคราวเต็ม กรุณาลบแผนเก่าออกก่อน");
          console.error("LocalStorage เต็ม", e);
          setIsSaving(false);
          return;
        }
      }

      const response = await planService.createPlan(planDataForApi);
      console.log("Response from backend:", response);

      alert("บันทึกแผนการเดินทางเรียบร้อยแล้ว!");
      navigate("/dashboard?reload=plans");
    } catch (error) {
      console.error("Error saving plan:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 400) {
        setError("ข้อมูลไม่ถูกต้อง: " + (error.response.data?.message || "กรุณาตรวจสอบข้อมูลอีกครั้ง"));
      } else {
        setError("เกิดข้อผิดพลาดในการบันทึกแผน: " + (error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("ต้องการยกเลิกการสร้างแผนนี้และกลับไปยังหน้าก่อนหน้าหรือไม่?")){
      navigate(-1);
    }
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
