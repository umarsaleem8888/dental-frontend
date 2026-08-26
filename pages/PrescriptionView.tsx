
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { ArrowLeft, Printer, FileText, User, Stethoscope, MapPin, Calendar, CheckCircle, Pill, Clock } from 'lucide-react';
import DentalChart from '../components/DentalChart';
import PrescriptionTemp1 from './PrescriptionTemp1';
import PrescriptionTemp2 from './PrescriptionTemp2';

import { useRef } from "react";

import usePrint from "@/hooks/usePrint";

import PrintButton from "../components/Print/PrintButton";
import { PrintWrapper } from '@/components/Print';

const PrescriptionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrint(printRef);

  const prescription = useSelector((state: RootState) =>
    state.prescriptions.list.find(p => (p?.id === id) || (p?._id === id))
  );

  // console.log(prescription, 'pppprc');




  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  if (!prescription) {
    return (
      <div className="text-center py-20">
        <FileText size={64} className="mx-auto text-slate-200 mb-4" />
        <h2 className="text-2xl font-bold">Prescription not found</h2>
        <Link to="/prescriptions" className="text-primary-500 mt-4 inline-block font-bold">Back to Prescriptions</Link>
      </div>
    );
  }

  const patient = patients.find(p => p.id === prescription.patientId);
  const doctor = doctors.find(d => d.id === prescription.doctorId);

  // console.log(patient , doctor , 'p and d');
  

  // const handlePrint = () => {
  //   window.print();
  // };

  return (
    <>

      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-bold tracking-tight">Prescription Record</h2>
        </div>

        {/* <button
          onClick={handlePrint}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Printer size={18} />
          Print Prescription
        </button> */}

        <PrintButton onPrint={handlePrint} />

      </div>



      <PrintWrapper
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        <div ref={printRef}>

          <PrescriptionTemp1 display={true} patient={patient} doctor={doctor} prescription={prescription} />

        </div>

      </PrintWrapper>

      {/* <PrescriptionTemp2 patient={patient} doctor={doctor} prescription={prescription} /> */}


      <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl border border-primary-100 dark:border-primary-800/30 flex items-center gap-3 print:hidden">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
          <Printer size={16} />
        </div>
        {/* //// */}

        {/**/}

        {/* //// */}
        <p className="text-xs text-primary-700 dark:text-primary-400 font-medium leading-tight">
          When printing, ensure "Background Graphics" is enabled in your browser settings to keep the dental chart highlights and layout colors.
        </p>
      </div>

      {/* //// */}



    </>

  );
};

export default PrescriptionView;
