import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const searchParams = new URLSearchParams(window.location.search);

    const trimmedSearch = search.trim().toLowerCase();

    searchParams.delete("search");

    if (trimmedSearch) {
      searchParams.set("search", trimmedSearch);
    }

    const newPath = `${window.location.pathname}?${searchParams.toString()}`;

    router.push(newPath);
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-1 bg-gray-100 p-[6px] rounded-md flex-1 mx-2 max-w-96"
    >
      <button type="submit" className="cursor-pointer" disabled={isLoading}>
        <SearchIcon className="h-4 text-gray-600" />
      </button>

      <input
        type="text"
        placeholder="Search posts"
        className="bg-transparent flex-1 outline-none"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
    </form>
  );
};

export default SearchInput;
