import React, { useState, useEffect, useRef } from "react";

interface Option {
  id: string;
  title: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  placeholder?: string;
  setSelectedProducts?: React.Dispatch<React.SetStateAction<Option[]>>;
  onSelect?: (selected: Option[]) => void;
  search?:string;
  setSearch?:React.Dispatch<React.SetStateAction<string>>;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  placeholder = "Select options",
  setSelectedProducts,
  onSelect,
  search,
  setSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((item) => item.id === option.id);
      const updatedOptions = exists
        ? prev.filter((item) => item.id !== option.id) 
        : [...prev, option]; 

      setSelectedProducts?.(updatedOptions); 
      onSelect?.(updatedOptions);

      return updatedOptions;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative " style={{minWidth:'600px'}} ref={dropdownRef}>
      <button
        className="w-full p-2 border rounded-lg flex justify-between items-center bg-white shadow-sm"
        onClick={toggleDropdown}
      >
        <span>
          {selectedOptions.length > 0
            ? selectedOptions.map((opt) => opt.title).join(", ")
            : placeholder}
        </span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="min-w-2xl absolute w-full mt-2 bg-white border rounded-lg shadow-lg z-10">
          <input
            type="text"
            className="w-full p-2 border-b focus:outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch!(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto">
            {options
              .filter((option) =>
                option.title.toLowerCase().includes(search!.toLowerCase())
              )
              .map((option) => (
                <li
                  key={option.id}
                  className="p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  <div
                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                      selectedOptions.some((item) => item.id === option.id)
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedOptions.some((item) => item.id === option.id) &&
                      "✔"}
                  </div>
                  {option.title}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
