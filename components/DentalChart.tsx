
import React from 'react';

import UpperTeeth1 from '../images/svg/uper 1.svg';
import UpperTeeth2 from '../images/svg/uper 2.svg';
import UpperTeeth3 from '../images/svg/uper 3.svg';
import UpperTeeth4 from '../images/svg/uper 4.svg';
import UpperTeeth5 from '../images/svg/uper 5.svg';
import UpperTeeth6 from '../images/svg/uper 6.svg';
import UpperTeeth7 from '../images/svg/uper 7.svg';
import UpperTeeth8 from '../images/svg/uper 8.svg';
import UpperTeeth9 from '../images/svg/uper 9.svg';
import UpperTeeth10 from '../images/svg/uper 10.svg';
import UpperTeeth11 from '../images/svg/uper 11.svg';
import UpperTeeth12 from '../images/svg/uper 12.svg';
import UpperTeeth13 from '../images/svg/uper 13.svg';
// import UpperTeeth14 from '../images/svg/uper 14.svg';
import UpperTeeth15 from '../images/svg/uper 15.svg';
import UpperTeeth16 from '../images/svg/uper 16.svg';

import LowerTeeth1 from '../images/svg/lower 1.svg';
import LowerTeeth2 from '../images/svg/lower 2.svg';
import LowerTeeth3 from '../images/svg/lower 3.svg';
import LowerTeeth4 from '../images/svg/lower 4.svg';
import LowerTeeth5 from '../images/svg/lower 5.svg';
import LowerTeeth6 from '../images/svg/lower 6.svg';
// import LowerTeeth7 from '../images/svg/lower 7.svg';
// import LowerTeeth8 from '../images/svg/lower 8.svg';
// import LowerTeeth9 from '../images/svg/lower 9.svg';
// import LowerTeeth10 from '../images/svg/lower 10.svg';
import LowerTeeth11 from '../images/svg/lower 11.svg';
import LowerTeeth12 from '../images/svg/lower 12.svg';
// import LowerTeeth13 from '../images/svg/lower 13.svg';
import LowerTeeth14 from '../images/svg/lower 14.svg';
import LowerTeeth15 from '../images/svg/lower 15.svg';
import LowerTeeth16 from '../images/svg/lower 16.svg';

interface DentalChartProps {
  selectedTeeth: number[];
  onToggleTooth: (toothId: number) => void;
  readOnly?: boolean;
}

const toothImages: Record<number, string> = {
  1: UpperTeeth1,
  2: UpperTeeth2,
  3: UpperTeeth3,
  4: UpperTeeth4,
  5: UpperTeeth5,
  6: UpperTeeth6,
  7: UpperTeeth7,
  8: UpperTeeth8,
  9: UpperTeeth9,
  10: UpperTeeth10,
  11: UpperTeeth11,
  12: UpperTeeth12,
  13: UpperTeeth13,
  14: UpperTeeth13,
  15: UpperTeeth15,
  16: UpperTeeth16,

  17: LowerTeeth15,
  18: LowerTeeth15,
  19: LowerTeeth14,
  20: LowerTeeth12,
  21: LowerTeeth12,
  22: LowerTeeth11,
  23: LowerTeeth6,
  24: LowerTeeth6,
  25: LowerTeeth6,
  26: LowerTeeth6,
  27: LowerTeeth6,
  28: LowerTeeth5,
  29: LowerTeeth4,
  30: LowerTeeth3,
  31: LowerTeeth2,
  32: LowerTeeth1,
};

const DentalChart: React.FC<DentalChartProps> = ({ selectedTeeth, onToggleTooth, readOnly = false }) => {
  const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);
  const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

  const Tooth = ({ id }: { id: number }) => {
    const isSelected = selectedTeeth.includes(id);
    return (

      <div onClick={() => onToggleTooth(id)} className={`mt-1  p-[1px] ml-[0.5px] mr-[0.5px] ${ isSelected ? 'shadow-sm  bg-[#0EA5E9] rounded-md ' : ''} `} >
        <img
          src={toothImages[id]}
          alt={`Tooth ${id}`}
          className={`cursor-pointer  w-4  h-14  object-contain transition-all ${isSelected ? ''  : ''
            }`}
        />
      </div>


    );
  };

  return (
    <div className="space-y-8 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex  justify-center ">
        {upperTeeth?.map(id => <Tooth key={id} id={id} />)}
      </div>
      <div className="flex  justify-center ">
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
