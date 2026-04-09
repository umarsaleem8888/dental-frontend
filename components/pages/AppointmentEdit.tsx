
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { updateAppointment } from '../slices/appointmentsSlice';
import { Appointment } from '../types';
import { ArrowLeft, Save, Calendar, Clock } from 'lucide-react';

const AppointmentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingApt = useSelector((state: RootState) => state.appointments.list.find(a => a.id === id));
  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const [formData, setFormData] = useState<Partial<Appointment>>({});

  useEffect(() => {
    if (existingApt) {
      setFormData(existingApt);
    }
  }, [existingApt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      dispatch(updateAppointment(formData as Appointment));
      navigate('/appointments');
    }
  };

  if (!existingApt) return <div className="p-10 text-center">Appointment not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Appointment</h2>
          <p className="text-slate-500">Reschedule or change session details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</label>
              <input required type="date" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.time || ''} onChange={e => setFormData({...formData, time: e.target.value})}>
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Procedure Type</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                {['Checkup', 'Cleaning', 'Surgery', 'Root Canal', 'Orthodontics'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Status</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <Save size={18} /> Update Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentEdit;
