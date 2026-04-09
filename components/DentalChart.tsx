
import React from 'react';

interface DentalChartProps {
  selectedTeeth: number[];
  onToggleTooth: (toothId: number) => void;
  readOnly?: boolean;
}

const DentalChart: React.FC<DentalChartProps> = ({ selectedTeeth, onToggleTooth, readOnly = false }) => {
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

  const Tooth = ({ id }: { id: number }) => {
    const isSelected = selectedTeeth.includes(id);
    return (
      <button
        type="button"
        disabled={readOnly}
        onClick={() => onToggleTooth(id)}
        className={`
          flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all w-10 sm:w-12 h-14
          ${isSelected 
            ? 'bg-primary-500 border-primary-600 text-white' 
            : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}
          ${readOnly ? 'cursor-default' : 'cursor-pointer'}
        `}
      >
        <span className="text-xs font-bold">{id}</span>
        <svg viewBox="0 0 24 24" className="w-6 h-6 mt-1 fill-current opacity-60">
          <path d="M12,2C9,2,7,4,7,7c0,1,0.5,2.5,1.5,4c1.2,1.8,1.5,4,1.5,5c0,2,1,3,2,3s2-1,2-3c0-1,0.3-3.2,1.5-5c1-1.5,1.5-3,1.5-4C17,4,15,2,12,2z" />
        </svg>
      </button>
    );
  };

  return (
    <div className="space-y-8 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap justify-center gap-2">
        {upperTeeth?.map(id => <Tooth key={id} id={id} />)}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {lowerTeeth?.map(id => <Tooth key={id} id={id} />)}
      </div>
      <div className="flex justify-center text-xs text-slate-400 font-medium space-x-8 uppercase tracking-widest">
        <span>Upper Jaw (1-16)</span>
        <span>Lower Jaw (17-32)</span>
      </div>
    </div>
  );
};

export default DentalChart;
