import React, { useState } from "react";
import { ChevronDown, Star, Clock, Heart } from "lucide-react";

const FilterDropdown = () => {
  const [selectedFilter, setSelectedFilter] = useState("Most Popular");
  
  const filters = [
    { name: "Most Popular", icon: <Star className="h-4 w-4 mr-2" /> },
    { name: "Most Recent", icon: <Clock className="h-4 w-4 mr-2" /> }, 
    { name: "Most Liked", icon: <Heart className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 bg-blue-100 rounded-md w-[150px] outline-none">
        <span className="text-blue-600">{selectedFilter}</span>
        <ChevronDown className="h-4 w-4 text-blue-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px] bg-white border shadow-md">
        {filters.map((filter) => (
          <DropdownMenuItem 
            key={filter.name}
            className="cursor-pointer hover:bg-blue-50 flex items-center"
            onClick={() => setSelectedFilter(filter.name)}
          >
            {filter.icon}
            {filter.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;