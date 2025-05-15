import React, { useState } from "react";
import TitleBlock from "./TitleBlock";
import CoverImageBlock from "./CoverImageBlock";
import BlockContainer from "./BlockContainer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const initialBlocks = [
  { id: uuidv4(), type: "notes", data: {} },
  { id: uuidv4(), type: "places", data: {} },
  { id: uuidv4(), type: "list", data: {} },
  { id: uuidv4(), type: "budget", data: {} },
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
  const navigate = useNavigate();

  const moveBlock = (from, to) => {
    const updated = [...blocks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setBlocks(updated);
  };

  const handleBlockChange = (idx, data) => {
    console.log("Block change:", { idx, data });
    setBlocks(blocks => {
      const updated = [...blocks];
      updated[idx] = { ...updated[idx], data };
      console.log("Updated blocks:", updated);
      return updated;
    });
  };

  const addBlock = type => {
    setBlocks(blocks => [
      ...blocks,
      { id: uuidv4(), type, data: {} },
    ]);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    alert("บันทึกแผนการเดินทางแล้ว!");
  };

  const handleDiscard = () => {
    navigate(-1);
  };

  return (
    <div className="w-screen p-0 m-0">
      <div className="m-4 relative">
        <CoverImageBlock imageUrl={coverImage} onChange={setCoverImage} />
        <TitleBlock title={title} onChange={setTitle} />
        <BlockContainer blocks={blocks} moveBlock={moveBlock} onBlockChange={handleBlockChange} />
        <div className="mt-6 flex justify-between items-end">
          <div className="flex gap-2">
            {blockTypes.map(bt => (
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
            >
              ยกเลิก
            </button>
            <button
              className="px-4 py-2 text-white rounded-lg bg-[#3674b5] hover:bg-[#2a5b8e] shadow"
              onClick={handleSave}
              type="button"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanEditor;
