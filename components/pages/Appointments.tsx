
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, Stethoscope, ChevronRight, Filter, Edit2, Trash2 } from 'lucide-react';
import { deleteAppointment } from '../slices/appointmentsSlice';
import ConfirmDialog from '../components/ConfirmDialog';

const Appointments: React.FC = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state: RootState) => state.appointments.list);
  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const handleDelete = () => {
    if (deleteModal.id) {
      dispatch(deleteAppointment(deleteModal.id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointment Scheduler</h2>
          <p className="text-slate-500 dark:text-slate-400">View and organize clinical appointments for all practitioners.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/appointments/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
            <CalendarIcon size={20} />
            Book New Session
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Clinic Calendar</h3>
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 italic">
                 Interactive View
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-4">
            {appointments.map(apt => {
              const patient = patients.find(p => p.id === apt.patientId);
              const doctor = doctors.find(d => d.id === apt.doctorId);
              return (
                <div key={apt.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary-500/30 transition-all flex flex-col md:flex-row md:items-center gap-6 group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-black">
                        {patient?.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-lg leading-tight group-hover:text-primary-500 transition-colors">{patient?.name}</h4>
                       <div className="flex items-center gap-3 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                          <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {apt.time}</span>
                          <span className="flex items-center gap-1 font-medium"><User size={12} /> {apt.type}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 px-6 md:border-x border-slate-100 dark:border-slate-800">
                    <div>
                       <p className="text-sm font-bold flex items-center gap-2">
                         <Stethoscope size={14} className="text-primary-500" />
                         {doctor?.name}
                       </p>
                       <p className="text-xs text-slate-400">{apt.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 min-w-[140px]">
                     <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                       apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                       apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 
                       'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                     }`}>
                       {apt.status}
                     </span>
                     <div className="flex items-center gap-1">
                        <Link title="Reschedule" to={`/appointments/edit/${apt.id}`} className="p-2 text-slate-300 hover:text-amber-500 transition-all">
                           <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: apt.id })}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-all"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Cancel Appointment?"
        subtitle="This will remove the session from the clinic schedule. The patient should be notified of this cancellation."
      />
    </div>
  );
};

export default Appointments;
