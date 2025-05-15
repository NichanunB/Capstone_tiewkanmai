import React from "react";

const DraggableBlock = ({ id, index, moveBlock, children }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("blockIndex", index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("blockIndex"), 10);
    if (fromIndex !== index) {
      moveBlock(fromIndex, index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="my-2 cursor-move bg-white rounded-lg shadow hover:shadow-lg transition"
    >
      {children}
    </div>
  );
};

export default DraggableBlock; 