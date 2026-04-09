
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { FilePlus, FileText, ExternalLink, Printer, Eye, Trash2 } from 'lucide-react';
import { deletePrescription } from '../slices/prescriptionsSlice';
import ConfirmDialog from '../components/ConfirmDialog';

const Prescriptions: React.FC = () => {
  const dispatch = useDispatch();
  const prescriptions = useSelector((state: RootState) => state.prescriptions.list);
  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const handleDelete = () => {
    if (deleteModal.id) {
      dispatch(deletePrescription(deleteModal.id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-slate-500 dark:text-slate-400">View and manage all treatment plans and medical records.</p>
        </div>
        <Link to="/prescriptions/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
          <FilePlus size={20} />
          Create Prescription
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.map(rx => {
          const patient = patients.find(p => p.id === rx.patientId);
          const doctor = doctors.find(d => d.id === rx.doctorId);
          return (
            <div key={rx.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                    <FileText size={24} />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 ${rx.status === 'Final' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {rx.status}
                    </span>
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, id: rx.id })}
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</p>
                  <p className="font-bold text-lg">{patient?.name || 'Unknown Patient'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doctor</p>
                    <p className="text-sm font-semibold">{doctor?.name.replace('Dr. ', '')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-semibold">{rx.date}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                  <p className="text-sm font-medium line-clamp-2">{rx.diagnosis}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {rx.selectedTeeth.slice(0, 3).map(t => (
                    <span key={t} className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">{t}</span>
                  ))}
                  {rx.selectedTeeth.length > 3 && <span className="text-xs text-slate-400 ml-1">+{rx.selectedTeeth.length - 3}</span>}
                </div>
                <div className="flex items-center gap-2">
                   <Link to={`/prescriptions/${rx.id}`} className="p-2 text-slate-400 hover:text-primary-500 transition-colors" title="View & Print">
                      <Eye size={18} />
                   </Link>
                   <Link to={`/patients/${rx.patientId}`} className="p-2 text-slate-400 hover:text-primary-500 transition-colors">
                      <ExternalLink size={18} />
                   </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Prescription?"
        subtitle="This will permanently remove the medical instructions and diagnosis from the record. Historical charts will be lost."
      />
    </div>
  );
};

export default Prescriptions;
