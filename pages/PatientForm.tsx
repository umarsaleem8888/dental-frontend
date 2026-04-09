
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPatient } from '../slices/patientsSlice';
import { Patient } from '../types';
import { ArrowLeft, UserPlus, Save, User, Phone, Mail, MapPin, Droplet, Hash, Loader2 } from 'lucide-react';
import { apiPost } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    email: '',
    phone: '',
    age: 25,
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    walletBalance: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData?.email || !formData?.name || !formData?.phone || !formData?.gender || !formData?.age || !formData?.bloodGroup) {

      showToast({
        text: "empty fields not allowed",
        type: "info",
      });

      return;
    }

    if (formData?.age <= 0) {
      showToast({
        text: "age should be greater than 0",
        type: "info",
      });

      return;
    }

    setLoading(true);

    try {
      const newPatient: Patient = {
        ...(formData as Patient),
        // id: `P${Math.floor(Math.random() * 9000) + 1000}`,
        // createdAt: new Date().toISOString().split('T')[0],
      };

      const m = await apiPost(`${baseUrl}/patient/`, formData);

      if (m) {

        console.log("m : ",m);
        

        const data = {
          id: m?.data?._id,
          name: m?.data?.name,
          phone: m?.data?.phone,
          walletBalance: m?.data?.walletBalance,
          bloodGroup: m?.data?.bloodGroup,
          age: m?.data?.age,
          address: m?.data?.address,
          gender: m?.data?.gender,
          email: m?.data?.email,
          balance: 0,
        }

        console.log("p data : ",data);
        

        dispatch(addPatient(data));
        setLoading(false);
        showToast({
          text: "Created Successfully",
          type: "success",
        });
      }

      // navigate('/patients');
    } catch (error: any) {
      setLoading(false);
      showToast({
        text: "not Created , try again",
        type: "error",
      });
      console.error(error.message);
    }
  };


  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Register Patient</h2>
          <p className="text-slate-500">Add a new patient to the clinical database.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g., Jonathan Smith"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="jonathan@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Phone size={14} /> Phone Number
              </label>
              <input
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Hash size={14} /> Age
              </label>
              <input
                required
                type="number"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Droplet size={14} /> Blood Group
              </label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <MapPin size={14} /> Residential Address
            </label>
            <textarea
              rows={3}
              placeholder="Full street address..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium resize-none"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
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
            {
              loading ?
                <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                  <Loader2 color={'#0ea5e9'} size={25} />
                </div>
                :
                <>
                  <Save size={18} /> Register Patient
                </>
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
