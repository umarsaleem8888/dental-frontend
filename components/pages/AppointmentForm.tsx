
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addAppointment } from '../slices/appointmentsSlice';
import { Appointment } from '../types';
import { ArrowLeft, Calendar, Save, User, Stethoscope, Clock, Zap } from 'lucide-react';

const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const patients = useSelector((state: RootState) => state.patients.list);
  const doctors = useSelector((state: RootState) => state.doctors.list);

  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    type: 'Checkup',
    status: 'Upcoming',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      ...formData as Appointment,
      id: `A${Math.floor(Math.random() * 9000) + 1000}`,
    };
    dispatch(addAppointment(newApt));
    navigate('/appointments');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Book Session</h2>
          <p className="text-slate-500">Schedule a new clinical visit for a patient.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={14} /> Select Patient
              </label>
              <select 
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.patientId}
                onChange={e => setFormData({...formData, patientId: e.target.value})}
              >
                <option value="">Choose Patient...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Stethoscope size={14} /> Assigned Doctor
              </label>
              <select 
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.doctorId}
                onChange={e => setFormData({...formData, doctorId: e.target.value})}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Calendar size={14} /> Date
              </label>
              <input 
                required
                type="date"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clock size={14} /> Time Slot
              </label>
              <select 
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              >
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Zap size={14} /> Procedure Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {['Checkup', 'Cleaning', 'Surgery', 'Root Canal', 'Orthodontics'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, type: type as any})}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                      formData.type === type 
                      ? 'border-primary-500 bg-primary-50/50 text-primary-600 shadow-inner' 
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            <Save size={18} /> Confirm Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
