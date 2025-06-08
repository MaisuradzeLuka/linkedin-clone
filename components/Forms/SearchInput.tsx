import { SearchIcon } from "lucide-react";
import { FormEvent, useState } from "react";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!showSearch) {
      setShowSearch(true);
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-1 bg-gray-100 p-[6px] rounded-md flex-1 mx-2 max-w-96"
    >
      <button type="submit" className="cursor-pointer">
        <SearchIcon className="h-4 text-gray-600" />
      </button>

      <input
        type="text"
        placeholder="Search"
        className="bg-transparent flex-1 outline-none"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
    </form>
  );
};

export default SearchInput;
