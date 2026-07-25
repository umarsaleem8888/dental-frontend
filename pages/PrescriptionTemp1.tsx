import { todayDate } from '@/utilz/getTodayDate';
import { BadgeCheck, Cake, CalendarDays, ChevronDown, ChevronDownIcon, ChevronUp, ClipboardList, Clock, FileHeart, Hash, MapPin, MessageSquareWarning, Package, Phone, Pill, Stethoscope, TriangleAlert, User, WineOff } from 'lucide-react';
import React from 'react'

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



interface PrescriptionTempProps {
    patient: any;
    doctor: any;
    prescription: any;
}

interface NotFoundProps {
    text: string;
}

interface SelectedTeethProps {
    teeth: string[];
}

const NotFound: React.FC<NotFoundProps> = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-6">
            <MessageSquareWarning size={25} className="text-[#A5B1C3]" />

            <p className="text-sm text-[#A5B1C3]">
                {text}
            </p>
        </div>
    );
};

const UpperToothObj = [
    {
        no: '1',
        svg: UpperTeeth1,
        selected: false,
    },
    {
        no: '2',
        svg: UpperTeeth2,
        selected: false,
    },
    {
        no: '3',
        svg: UpperTeeth3,
        selected: false,
    },
    {
        no: '4',
        svg: UpperTeeth4,
        selected: false,
    },
    {
        no: '5',
        svg: UpperTeeth5,
        selected: false,
    },
    {
        no: '6',
        svg: UpperTeeth6,
        selected: false,
    },
    {
        no: '7',
        svg: UpperTeeth7,
        selected: false,
    },
    {
        no: '8',
        svg: UpperTeeth8,
        selected: false,
    },
    {
        no: '9',
        svg: UpperTeeth9,
        selected: false,
    },
    {
        no: '10',
        svg: UpperTeeth10,
        selected: false,
    },
    {
        no: '11',
        svg: UpperTeeth11,
        selected: false,
    },
    {
        no: '12',
        svg: UpperTeeth12,
        selected: false,
    },
    {
        no: '13',
        svg: UpperTeeth13,
        selected: false,
    },
    {
        no: '14',
        svg: UpperTeeth15,
        selected: false,
    },
    {
        no: '15',
        svg: UpperTeeth15,
        selected: false,
    },
    {
        no: '16',
        svg: UpperTeeth16,
        selected: false,
    },
]

const LowerToothObj = [
    {
        no: '17',
        svg: LowerTeeth1,
        selected: false,
    },
    {
        no: '18',
        svg: LowerTeeth2,
        selected: false,
    },
    {
        no: '19',
        svg: LowerTeeth3,
        selected: false,
    },
    {
        no: '20',
        svg: LowerTeeth4,
        selected: false,
    },
    {
        no: '21',
        svg: LowerTeeth5,
        selected: false,
    },
    {
        no: '22',
        svg: LowerTeeth6,
        selected: false,
    },
    {
        no: '23',
        svg: LowerTeeth6,
        selected: false,
    },
    {
        no: '24',
        svg: LowerTeeth6,
        selected: false,
    },
    {
        no: '25',
        svg: LowerTeeth6,
        selected: false,
    },
    {
        no: '26',
        svg: LowerTeeth6,
        selected: false,
    },
    {
        no: '27',
        svg: LowerTeeth11,
        selected: false,
    },
    {
        no: '28',
        svg: LowerTeeth12,
        selected: false,
    },
    {
        no: '29',
        svg: LowerTeeth12,
        selected: false,
    },
    {
        no: '30',
        svg: LowerTeeth14,
        selected: false,
    },
    {
        no: '31',
        svg: LowerTeeth15,
        selected: false,
    },
    {
        no: '32',
        svg: LowerTeeth16,
        selected: false,
    },
]

const Tooth: React.FC<SelectedTeethProps> = ({ teeth }) => {

    return (
        <>
            <div className='flex flex-col gap-2' >
                <div className='  upperTooth flex' >
                    {
                        UpperToothObj?.map((item, indx) => {
                            return (
                                <>
                                    <div className='flex flex-col gap-0 justify-center items-center' >
                                        {
                                            <>
                                                {
                                                    teeth?.some(t => t === String(item.no)) && (
                                                        <div className='bg-red-600 rounded-full h-1 w-1'></div>
                                                    )
                                                }
                                                <img src={item.svg} className=' h-12 w-4' />
                                            </>
                                        }
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                <div className='  lowerTooth flex' >
                    {
                        LowerToothObj?.map((item, indx) => {
                            return (
                                <>
                                    <div className='flex flex-col gap-0 justify-center items-center' >
                                        {
                                            <>
                                                <img src={item.svg} className=' h-12 w-4' />
                                                {
                                                    teeth?.some(t => t === String(item.no)) && (
                                                        <div className='bg-red-600 rounded-full h-1 w-1'></div>
                                                    )
                                                }
                                            </>
                                        }
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )

}

const prescriptionTemp1: React.FC<PrescriptionTempProps> = ({
    patient,
    doctor,
    prescription,
}) => {

    console.log(prescription?.selectedTeeth, 'pres');


    return (
        <div>

            {/* <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 px-8 py-6"> */}

            <div className="max-w-4xl m-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none print:rounded-none grid grid-cols-12 gap-4 print:gap-2">


                {/* Name */}
                <div className=" col-span-3 mt-5 print:mt-5 ml-5 mr-5 print:mt-3 print:ml-3 print:mr-3">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        <User size={14} className="text-sky-600" />
                        Patient Name
                    </p>

                    <div className="h-7 px-0 flex items-end border-b-2 border-slate-300 hover:border-sky-500 transition-colors duration-300">
                        {/* Dynamic Name */}
                        {patient?.name || 'N/A'}


                    </div>
                </div>

                {/* Age */}
                <div className="col-span-2 mt-5 ml-5">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        <Cake size={14} className="text-sky-600" />
                        Age
                    </p>

                    <div className="h-7 px-0 flex items-end border-b-2 border-slate-300 hover:border-sky-500 transition-colors duration-300">


                        {patient?.age || 'N/A'}


                    </div>
                </div>

                {/* Patient ID */}
                <div className="col-span-3 mt-5 ml-5">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        <Hash size={14} className="text-sky-600" />
                        Patient ID
                    </p>

                    <div className="h-7 px-0 flex items-end border-b-2 border-slate-300 hover:border-sky-500 transition-colors duration-300">

                        {/* {patient?.id || 'N/A'} */}
                        N/A
                    </div>
                </div>

                {/* Date */}
                <div className="col-span-4 mt-5 ml-5 mr-5">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        <CalendarDays size={14} className="text-sky-600" />
                        Date
                    </p>

                    <div className="h-7 px-0 flex items-end border-b-2 border-slate-300 hover:border-sky-500 transition-colors duration-300">
                        {todayDate}
                    </div>
                </div>


                {/* ================= LEFT PANEL ================= */}

                <div className="mt-4 col-span-4 bg-white border-r border-slate-200 flex flex-col">

                    {/* ================= Doctor Information ================= */}

                    <div className="px-5 pt-1 pb-1 print:px-4 print:pb-1 border-b border-slate-200">

                        <h6 className="  shadow-sm flex  items-center p-4 gap-2 text-[17px] font-bold tracking-wide text-slate-800">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">

                                <Stethoscope size={20} className="text-sky-600" />

                            </div>

                            {doctor?.name || 'N/A'}


                            {/* <p className="mt-1 text-sm font-medium text-sky-700">
                            BDS, RDS
                        </p> */}
                        </h6>

                        <div className="mt-5 space-y-3 text-[13px] text-slate-600">

                            {/* <div className="flex items-center gap-3">
                                <BadgeCheck size={16} className="text-sky-600" />
                                <span>PMDC No : XXXXX</span>
                            </div> */}

                            {/* <div className="flex items-center gap-3">
                                <Stethoscope size={16} className="text-sky-600" />
                                <span>Specialist in Restorative Dentistry</span>
                                {doctor?.specialization || 'N/A'}
                            </div> */}

                            {/* <div className="flex items-center gap-3">
                                <Phone size={16} className="text-sky-600" />
                                <span>0321-1234567</span>
                            </div> */}
                            {/* 
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-sky-600 mt-1" />
                                <span>
                                    Dental Expert Clinic
                                    <br />
                                    Lahore, Pakistan
                                </span>
                            </div> */}

                        </div>

                    </div>



                    {/* ================= CLINICAL INSTRUCTIONS  ================= */}

                    <section className="border-b border-slate-200">

                        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-600">

                            <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.20em] font-semibold text-white">
                                <FileHeart size={15} />
                                CLINICAL INSTRUCTIONS
                            </h3>

                        </div>

                        <div className="min-h-[85px] p-2">

                            {
                                prescription?.diagnosis ?
                                    <p className='text-slate-600' >
                                        {prescription?.diagnosis}
                                    </p>
                                    :
                                    <NotFound text={'Clinic Diagnosis Details Not Found'} />
                            }

                        </div>

                    </section>



                    {/* ================= Examination ================= */}

                    <section className="border-b border-slate-200">

                        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-600">

                            <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.20em] font-semibold text-white">
                                <ClipboardList size={15} />
                                Examination
                            </h3>

                        </div>

                        <div className="min-h-[85px]  flex justify-center items-center flex-col">

                            <div className='mt-4 mb-4 w-[90%]' >
                                <Tooth teeth={prescription?.selectedTeeth} />
                            </div>


                            <div className=' flex flex-wrap gap-1 text-[9px] text-[#667792] w-[100%] mt-1 mb-2  p-1' >
                                {
                                    prescription?.selectedTeeth?.map((t: any, i: any) => {
                                        return (
                                            <>

                                                {
                                                    <span className="border shadow-sm px-2 rounded-xl flex items-center gap-1">
                                                        {t < 17 ? (
                                                            <>
                                                              <ChevronUp size={12}/>
                                                              {t}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown size={12} />
                                                                {t}
                                                            </>
                                                        )}
                                                    </span>

                                                }

                                            </>
                                        )
                                    })
                                }
                            </div>


                        </div>

                    </section>



                    {/* ================= Diagnosis Details ================= */}

                    <section className="flex-1">

                        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-600">

                            <h3 className="text-xs uppercase tracking-[0.20em] font-semibold text-white">
                                DIAGNOSIS DETAILS
                            </h3>

                        </div>

                        <div className="min-h-[85px] p-2">

                            {
                                prescription?.diagnosis ?
                                    <p className='text-slate-600' >
                                        {prescription?.notes}
                                    </p>
                                    :
                                    <NotFound text={'Clinic Notes Not Found'} />
                            }

                        </div>

                    </section>

                </div>

                {/* //// */}

                {/* ================= RIGHT PANEL ================= */}

                <div className=" mt-4 relative col-span-8 overflow-hidden bg-white">

                    {/* ================= Watermark ================= */}

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                        <img
                            src="/logo.png"
                            alt="Watermark"
                            className="
        w-[420px]
        object-contain
        opacity-[0.04]
        select-none
      "
                        />

                    </div>

                    {/* ================= RX HEADER ================= */}

                    <div className="relative z-10 px-2 pt-2 pb-6  border-slate-200">

                        <div className="flex items-center justify-start">

                            <div className="flex flex-col items-stat jusity-start">

                                {/* Logo */}



                                {/* RX */}

                                <h1 className="
          text-4xl
          font-bold
          tracking-[0.20em]
          text-slate-800
          leading-none
        
        ">
                                    Rx
                                </h1>

                                <div className="mt-4 h-[2px] w-28 rounded-full bg-sky-500"></div>

                            </div>

                        </div>

                    </div>

                    {/* ================= MEDICINE AREA ================= */}

                    <div className="  relative z-10 mt-2 ">

                        {/* Dynamic Table */}

                        {/* //////////////// */}

                        <div className="relative z-10 p-2 mr-6">

                            {/* Header */}

                            <div className="overflow-hidden rounded-2xl border border-slate-200">

                                {/* Header */}

                                <div className="grid grid-cols-[4fr_4fr_4fr] bg-gradient-to-r from-slate-800 to-slate-600 text-white">

                                    <div className="px-4 py-4 text-xs uppercase tracking-[0.18em] font-semibold">
                                        Medicine
                                    </div>

                                    <div className="px-4 py-4 text-center text-xs uppercase tracking-[0.18em] font-semibold">
                                        Dosage
                                    </div>

                                    <div className="px-4 py-4 text-center text-xs uppercase tracking-[0.18em] font-semibold">
                                        Duration
                                    </div>

                                    {/* <div className="px-4 py-4 text-center text-xs uppercase tracking-[0.18em] font-semibold">
                                        Quantity
                                    </div> */}

                                </div>

                                {/* Medicines */}

                                <div className="bg-white">

                                    {prescription?.medicines?.length > 0 ? (

                                        prescription?.medicines?.map((med: any, index: number) => (

                                            <div
                                                key={index}
                                                className="
                        grid
                        grid-cols-[4fr_4fr_4fr]
                        items-center
                        border-b
                        border-slate-100
                        hover:bg-sky-50/40
                        transition
                    "
                                            >

                                                {/* Medicine */}

                                                <div className="flex items-center gap-4 px-6 py-3 print:py-2">

                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100">

                                                        <Pill
                                                            size={18}
                                                            className="text-sky-600"
                                                        />

                                                    </div>

                                                    <div>

                                                        <h4 className="font-semibold text-slate-800">

                                                            {med.name}

                                                        </h4>

                                                        <p className="text-xs text-slate-400">

                                                            Oral Medicine

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* Dosage */}

                                                <div className="flex justify-center px-3">

                                                    <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">

                                                        <Clock
                                                            size={14}
                                                            className="text-amber-600"
                                                        />

                                                        <span className="font-semibold text-amber-700">

                                                            {med.dosage}

                                                        </span>

                                                    </div>

                                                </div>

                                                {/* Duration */}

                                                <div className="flex justify-center px-3">

                                                    <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">

                                                        <CalendarDays
                                                            size={14}
                                                            className="text-emerald-600"
                                                        />

                                                        <span className="font-semibold text-emerald-700">

                                                            {med.duration} Days

                                                        </span>

                                                    </div>

                                                </div>

                                                {/* Quantity */}

                                                {/* <div className="flex justify-center px-3">

                                                    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">

                                                        <Package
                                                            size={14}
                                                            className="text-slate-600"
                                                        />

                                                        <span className="font-semibold text-slate-700">

                                                            {med.quantity}

                                                        </span>

                                                    </div>

                                                </div> */}

                                            </div>

                                        ))

                                    ) : (

                                        <div className="flex flex-col items-center justify-center py-20">

                                            <Pill
                                                size={42}
                                                className="text-slate-300"
                                            />

                                            <h3 className="mt-4 font-semibold text-slate-500">

                                                No Medicines Prescribed

                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">

                                                No medications have been added yet.

                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                        {/* /////////////// */}

                    </div>

                </div>

                {/* <div className="col-span-12 border-t border-slate-200 px-6 py-4 flex justify-end">
                    <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">

                        <TriangleAlert
                            size={15}
                            className="text-amber-600 flex-shrink-0"
                        />

                        <p className="text-[11px] font-medium tracking-wide text-slate-600 italic">
                            This prescription is not valid for court .
                        </p>

                    </div>
                </div> */}

                <div className="col-span-12 border-t border-slate-200 px-6 py-1 flex justify-end">
                    <div className="flex items-center gap-2 rounded-md px-3 py-2">
                        <p className="text-[11px] font-medium tracking-wide text-slate-600 italic">
                            This prescription is not valid for court .
                        </p>

                    </div>
                </div>



                {/* //// */}


                {/* //// */}

            </div>

        </div >
    )
}

export default prescriptionTemp1
