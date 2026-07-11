import { todayDate } from '@/utilz/getTodayDate';
import { BadgeCheck, Cake, CalendarDays, ClipboardList, Clock, FileHeart, Hash, MapPin, MessageSquareWarning, Package, Phone, Pill, Stethoscope, TriangleAlert, User, WineOff } from 'lucide-react';
import React from 'react'

interface PrescriptionTempProps {
    patient: any;
    doctor: any;
    prescription: any;
}

interface NotFoundProps {
    text: string;
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

const prescriptionTemp1: React.FC<PrescriptionTempProps> = ({
    patient,
    doctor,
    prescription,
}) => {
    return (
        <div>

            {/* <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 px-8 py-6"> */}

            <div className="max-w-4xl m-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none print:rounded-none grid grid-cols-12 gap-6">


                {/* Name */}
                <div className="col-span-3 mt-7 ml-7">
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
                <div className="col-span-2 mt-7 ml-7">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        <Cake size={14} className="text-sky-600" />
                        Age
                    </p>

                    <div className="h-7 px-0 flex items-end border-b-2 border-slate-300 hover:border-sky-500 transition-colors duration-300">


                        {patient?.age || 'N/A'}


                    </div>
                </div>

                {/* Patient ID */}
                <div className="col-span-3 mt-7 ml-7">
                    <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-2">
                        <Hash size={14} className="text-sky-600" />
                        Patient ID
                    </p>

                    <div className="h-7 px-0 flex items-end border-b-2 border-slate-300 hover:border-sky-500 transition-colors duration-300">

                        {/* {patient?.id || 'N/A'} */}
                        123456
                    </div>
                </div>

                {/* Date */}
                <div className="col-span-4 mt-7 ml-7 mr-7">
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

                    <div className="px-7 pt-2 pb-6 border-b border-slate-200">

                        <h6 className="  shadow-sm flex  items-start p-4 gap-2 text-[17px] font-bold tracking-wide text-slate-800">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">

                                <Stethoscope size={20} className="text-sky-600" />

                            </div>

                            {doctor?.name || 'N/A'}


                            {/* <p className="mt-1 text-sm font-medium text-sky-700">
                            BDS, RDS
                        </p> */}
                        </h6>

                        <div className="mt-5 space-y-3 text-[13px] text-slate-600">

                            <div className="flex items-center gap-3">
                                <BadgeCheck size={16} className="text-sky-600" />
                                <span>PMDC No : XXXXX</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Stethoscope size={16} className="text-sky-600" />
                                {/* <span>Specialist in Restorative Dentistry</span> */}
                                {doctor?.specialization || 'N/A'}


                            </div>

                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-sky-600" />
                                <span>0321-1234567</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-sky-600 mt-1" />
                                <span>
                                    Dental Expert Clinic
                                    <br />
                                    Lahore, Pakistan
                                </span>
                            </div>

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

                        <div className="min-h-[180px] p-6">

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

                        <div className="min-h-[220px] p-6">

                            teeth chart will be founded there

                        </div>

                    </section>



                    {/* ================= Diagnosis Details ================= */}

                    <section className="flex-1">

                        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-600">

                            <h3 className="text-xs uppercase tracking-[0.20em] font-semibold text-white">
                                DIAGNOSIS DETAILS
                            </h3>

                        </div>

                        <div className="min-h-[260px] p-6">

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
          text-6xl
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

                                                <div className="flex items-center gap-4 px-6 py-5">

                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100">

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

                <div className="col-span-12 border-t border-slate-200 px-6 py-4 flex justify-end">
                    <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2">

                        <TriangleAlert
                            size={15}
                            className="text-amber-600 flex-shrink-0"
                        />

                        <p className="text-[11px] font-medium tracking-wide text-slate-600 italic">
                            This prescription is not valid for legal or court purposes.
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
