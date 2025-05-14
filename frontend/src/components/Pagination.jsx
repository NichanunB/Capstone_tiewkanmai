export default function Pagination() {
  return (
    <div className="flex justify-center my-6">
      <div className="flex items-center space-x-2">
        <a href="#" className="text-gray-500">{'< Previous'}</a>
        <a href="#" className="px-3 py-1 bg-[#3674B5] text-white rounded">1</a>
        <a href="#" className="px-3 py-1 text-gray-700">2</a>
        <a href="#" className="px-3 py-1 text-gray-700">3</a>
        <span className="text-gray-500">...</span>
        <a href="#" className="px-3 py-1 text-gray-700">141</a>
        <a href="#" className="text-gray-500">{'Next >'}</a>
      </div>
    </div>
  );
}
