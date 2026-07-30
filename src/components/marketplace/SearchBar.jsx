import { Search } from "lucide-react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="container-width -mt-8">
      <div className="rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <Search className="text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search produce, farmers or location..."
            className="w-full border-none bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;