import React, { useState, useEffect } from "react";
import TitleBlock from "./TitleBlock";
import CoverImageBlock from "./CoverImageBlock";
import BlockContainer from "./BlockContainer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios"; // Import axios directly for emergency fallback
import services from "../../services/api";
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

  // Emergency fallback direct API call function
  const emergencySavePlan = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const token = localStorage.getItem('token');
      
      // Create a clean string copy of the data
      const blocksStringified = JSON.stringify(blocks);
      
      // Prepare emergency data
      const emergencyData = {
        title: title.trim(),
        coverImage: coverImage || null,
        note: "",
        // Use a string for jsonData
        jsonData: blocksStringified
      };
      
      console.log("🚨 EMERGENCY SAVE ATTEMPT with stringified data:", emergencyData);
      
      const response = await axios.post(`${API_URL}/plans`, emergencyData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Emergency save response:", response);
      return response;
    } catch (error) {
      console.error("Emergency save failed:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!title || !title.trim()) {
      setError("กรุณากรอกชื่อแผนท่องเที่ยว");
      return;
    }

    if (!blocks || blocks.length === 0) {
      setError("กรุณาเพิ่มอย่างน้อย 1 block");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // สร้างข้อมูลแผนเที่ยว
      const planData = {
        title: title.trim(),
        coverImage: coverImage || null,
        note: "",
        jsonData: JSON.stringify(blocks),
        isPublic: true,
        status: "active"
      };

      console.log("Sending planData to API:", planData);

      // บันทึกลง API
      const response = await planService.createPlan(planData);
      
      if (response.data) {
        // บันทึกลง localStorage เป็นสำเนา
        const userPlans = JSON.parse(localStorage.getItem('userPlans') || '[]');
        userPlans.push({
          ...response.data,
          isLocalCopy: true
        });
        localStorage.setItem('userPlans', JSON.stringify(userPlans));

        alert("บันทึกแผนการเดินทางเรียบร้อยแล้ว!");
        navigate("/dashboard?reload=plans");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      setError(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกแผน");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("ต้องการยกเลิกการสร้างแผนนี้และกลับไปยังหน้าก่อนหน้าหรือไม่?")) {
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