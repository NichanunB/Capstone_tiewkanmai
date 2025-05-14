import React from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

const SearchPlacesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ค้นหาสถานที่</h1>
      <SearchBar />
      <SearchResults />
    </div>
  );
};

export default SearchPlacesPage;
