import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
}

interface GenericDropdownProps {
  options: DropdownOption[];
  storageKey: string;        // localStorage key
  placeholder?: string;
  onSelect?: (option: DropdownOption) => void;
}

const GenericDropdown: React.FC<GenericDropdownProps> = ({
  options,
  storageKey,
  placeholder = "Select option",
  onSelect,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<DropdownOption | null>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  });

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- HANDLE SELECT ---------------- */
  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    localStorage.setItem(storageKey, JSON.stringify(option));
    onSelect?.(option);
    setOpen(false);
    setSearch("");
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 border rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <span className="text-sm font-medium">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 border rounded-xl shadow-lg overflow-hidden">
          
          {/* Search */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-7 pr-2 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2 cursor-pointer text-sm
                    ${
                      selected?.value === opt.value
                        ? "bg-primary-600 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericDropdown;
