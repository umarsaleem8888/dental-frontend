
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { ArrowLeft, Printer, FileText, User, Stethoscope, MapPin, Calendar, CheckCircle, Pill, Clock } from 'lucide-react';
import DentalChart from '../components/DentalChart';

const PrescriptionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const prescription = useSelector((state: RootState) => 
    state.prescriptions.list.find(p => (p?.id === id) || (p?._id === id))
  );

  console.log(prescription,'pppprc');
  
  
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 print:space-y-4 pb-20">
      {/* Navigation Header - Hidden on Print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-bold tracking-tight">Prescription Record</h2>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Printer size={18} />
          Print Prescription
        </button>
      </div>

      {/* Prescription Document */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Clinic Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
           <div className="space-y-1">
             <h1 className="text-2xl font-black tracking-tighter text-primary-600">DENTFLOW CLINIC</h1>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Premium Dental Care Solutions</p>
             <div className="pt-4 text-xs text-slate-500 font-medium space-y-1">
                <p className="flex items-center gap-2"><MapPin size={12} /> 123 Healthcare Way, Medical District, NY</p>
                <p className="flex items-center gap-2"><Calendar size={12} /> Hours: Mon - Sat (9AM - 8PM)</p>
             </div>
           </div>
           <div className="text-right">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <CheckCircle size={12} /> Official Document
             </div>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Prescription ID</p>
             <p className="text-lg font-black">{prescription.id}</p>
             <p className="text-sm font-bold text-slate-500">{prescription.date}</p>
           </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <User size={14} className="text-primary-500" /> Patient Information
               </h3>
               <div>
                  <p className="text-xl font-bold">{patient?.name || 'N/A'}</p>
                  <p className="text-sm font-medium text-slate-500">Age: {patient?.age} • Gender: {patient?.gender}</p>
                  <p className="text-sm font-medium text-slate-500 mt-2">ID: {patient?.id}</p>
               </div>
            </div>
            <div className="space-y-4 p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Stethoscope size={14} className="text-primary-500" /> Consulting Doctor
               </h3>
               <div>
                  <p className="text-xl font-bold">{doctor?.name || 'Dr. Assigned'}</p>
                  <p className="text-sm font-medium text-slate-500">{doctor?.specialization}</p>
                  <p className="text-sm font-medium text-slate-500 mt-2">{doctor?.email}</p>
               </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="space-y-4">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-primary-500 pl-3">Diagnosis Details</h3>
             <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{prescription.diagnosis}</p>
             </div>
          </div>

          {/* Medication Table - NEW SECTION */}
          <div className="space-y-4">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-primary-500 pl-3">Medications & Dosage</h3>
             <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-4">Medicine</th>
                      <th className="px-6 py-4">Dosage (D-N-N)</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {prescription.medicines?.map((med, idx) => (
                      <tr key={idx} className="text-sm">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <Pill size={14} className="text-primary-500" />
                             <p className="font-bold">{med.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <Clock size={12} className="text-slate-400" />
                              <span className="font-black text-slate-700 dark:text-slate-200">{med.dosage}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-bold">{med.duration} Days</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-black">{med.quantity} Units</span>
                        </td>
                      </tr>
                    ))}
                    {(!prescription.medicines || prescription.medicines.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No medications prescribed.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Dental Chart View */}
          <div className="space-y-4">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-primary-500 pl-3">Dental Map & Procedures</h3>
             <DentalChart 
                selectedTeeth={prescription.selectedTeeth.map(t => Number(t))}
                onToggleTooth={() => {}} 
                readOnly={true} 
             />
             <div className="flex flex-wrap gap-2 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full mb-1">Affected Teeth IDs:</p>
                {prescription?.selectedTeeth.map(t => (
                  <span key={t} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-black">
                    Tooth #{t}
                  </span>
                ))}
                {prescription.selectedTeeth.length === 0 && <span className="text-xs text-slate-400 italic">No specific teeth targeted.</span>}
             </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-primary-500 pl-3">Clinical Instructions</h3>
             <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-2xl italic text-slate-600 dark:text-slate-400 text-sm">
                {prescription.notes || 'Continue oral hygiene as discussed.'}
             </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-12 flex justify-between items-end border-t border-slate-100 dark:border-slate-800">
             <div className="text-[10px] text-slate-400 font-medium">
                <p>Generated by DentFlow SaaS Platform</p>
                <p>© 2024 DentFlow Medical Systems</p>
             </div>
             <div className="w-48 text-center">
                <div className="h-10 border-b-2 border-slate-200 dark:border-slate-700 italic font-serif text-slate-400">
                  {doctor?.name}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Authorized Signature</p>
             </div>
          </div>
        </div>
      </div>

      {/* Print Instructions Overlay - Hidden on Print */}
      <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl border border-primary-100 dark:border-primary-800/30 flex items-center gap-3 print:hidden">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
           <Printer size={16} />
        </div>
        <p className="text-xs text-primary-700 dark:text-primary-400 font-medium leading-tight">
          When printing, ensure "Background Graphics" is enabled in your browser settings to keep the dental chart highlights and layout colors.
        </p>
      </div>
    </div>
  );
};

export default PrescriptionView;
