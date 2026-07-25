import React from "react";
import { Printer } from "lucide-react";

interface Props {
  onPrint: () => void;
}

const PrintButton: React.FC<Props> = ({ onPrint }) => {
  return (
    <button
      onClick={onPrint}
      className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-sky-600
        px-4
        py-2
        text-white
        transition
        hover:bg-sky-700
      "
    >
      <Printer size={18} />

      Print Prescription
    </button>
  );
};

export default PrintButton;