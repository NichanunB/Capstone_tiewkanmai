import React from "react";
import DraggableBlock from "./DraggableBlock";
import NotesBlock from "./blocks/NotesBlock";
import PlacesBlock from "./blocks/PlacesBlock";
import ListBlock from "./blocks/ListBlock";
import BudgetBlock from "./blocks/BudgetBlock";

const blockTypeToComponent = {
  notes: NotesBlock,
  places: PlacesBlock,
  list: ListBlock,
  budget: BudgetBlock,
};

const BlockContainer = ({ blocks, moveBlock, onBlockChange }) => {
  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        const BlockComponent = blockTypeToComponent[block.type];
        if (!BlockComponent) return null;
        return (
          <DraggableBlock key={block.id} id={block.id} index={idx} moveBlock={moveBlock}>
            <BlockComponent data={block.data} onChange={data => onBlockChange(idx, data)} />
          </DraggableBlock>
        );
      })}
    </div>
  );
};

export default BlockContainer; 