import { useEffect, useRef, useState } from "react";
import { Filter , CalendarSearch  } from "lucide-react";

export default function InvoiceFilter({ handleTypeChange }: any) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);

  const [selected, setSelected] = useState(
    localStorage.getItem("invoice_filter_type") || "all"
  );

  const [fromDate, setFromDate] = useState(
    localStorage.getItem("invoice_filter_from") || ""
  );
  const [toDate, setToDate] = useState(
    localStorage.getItem("invoice_filter_to") || ""
  );

  /* ------------------ OUTSIDE CLICK HANDLER ------------------ */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setShowDatePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------ INITIAL LOAD FROM STORAGE ------------------ */
  useEffect(() => {
    if (selected === "date" && fromDate && toDate) {
      handleTypeChange?.({ type: "date", from: fromDate, to: toDate });
    } else {
      handleTypeChange?.({ type: selected });
    }
  }, []);

  /* ------------------ HELPERS ------------------ */
  const persist = (type: string, from = "", to = "") => {
    localStorage.setItem("invoice_filter_type", type);
    localStorage.setItem("invoice_filter_from", from);
    localStorage.setItem("invoice_filter_to", to);
  };

  const handleSelect = (type: string) => {
    setSelected(type);
    setOpen(false);

    if (type === "date") {
      setShowDatePopup(true);
      persist(type, fromDate, toDate);
      return;
    }

    persist(type);
    handleTypeChange?.({ type });
  };

  const applyDateFilter = () => {
    persist("date", fromDate, toDate);
    handleTypeChange?.({ type: "date", from: fromDate, to: toDate });
    setShowDatePopup(false);
  };

  const itemClass = (type: string) =>
    `px-4 py-2 cursor-pointer rounded-md text-sm
     ${selected === type
      ? "bg-primary-600 text-white"
      : "hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  /* ------------------ UI ------------------ */
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Filter size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border rounded-xl shadow-lg z-50 p-1">
          <div className={itemClass("all")} onClick={() => handleSelect("all")}>
             All Invoices
          </div>

          <div className={itemClass("today")} onClick={() => handleSelect("today")}>
            Today Invoices
          </div>

           <div className={itemClass("week")} onClick={() => handleSelect("week")}>
             This Week 
          </div>

            <div className={itemClass("month")} onClick={() => handleSelect("month")}>
             This Month
          </div>

            <div className={itemClass("year")} onClick={() => handleSelect("year")}>
             This Year
          </div>

          {/* backgroundColor:'#f7f7f7' */}

          <div style={{ display:'flex', alignItems :'center' }} className={`${itemClass("date")}`} onClick={() => handleSelect("date")}>
            Select by Date 
            <CalendarSearch style={{marginLeft:'6px'}} size={14} />
          </div>
        </div>
      )}

      {/* Date Popup */}
      {showDatePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-white dark:bg-slate-900 p-6 rounded-xl w-[320px]"
          >
            <h3 className="text-lg font-bold mb-4">Select Date Range</h3>

            <div className="mb-3">
              <label className="text-sm">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDatePopup(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={applyDateFilter}
                disabled={!fromDate || !toDate}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
