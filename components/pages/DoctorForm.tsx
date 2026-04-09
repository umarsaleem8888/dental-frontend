
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addDoctor } from '../slices/doctorsSlice';
import { Doctor } from '../types';
import { ArrowLeft, Stethoscope, Save, User, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

const DoctorForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: 'Dr. ',
    specialization: '',
    phone: '',
    email: '',
    status: 'Active',
    availability: ['Monday', 'Tuesday', 'Wednesday'],
  });

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability?.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...(prev.availability || []), day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Doctor = {
      ...formData as Doctor,
      id: `D${Math.floor(Math.random() * 900) + 100}`,
    };
    dispatch(addDoctor(newDoc));
    navigate('/doctors');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Onboard Practitioner</h2>
          <p className="text-slate-500">Add a new specialist to your clinical staff.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={14} /> Full Professional Name
              </label>
              <input 
                required
                type="text"
                placeholder="Dr. Sarah Wilson"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldCheck size={14} /> Specialization
              </label>
              <input 
                required
                type="text"
                placeholder="e.g., Oral Surgery"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.specialization}
                onChange={e => setFormData({...formData, specialization: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input 
                required
                type="email"
                placeholder="sarah@clinic.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Phone size={14} /> Contact Number
              </label>
              <input 
                required
                type="tel"
                placeholder="+1 (555) 012-3456"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Clock size={14} /> Weekly Shift Availability
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.availability?.includes(day)
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
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
            <Stethoscope size={18} /> Finish Onboarding
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
