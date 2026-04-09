
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { updatePatient } from '../slices/patientsSlice';
import { Patient } from '../types';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Droplet, Hash, Loader2 } from 'lucide-react';
import { apiPut } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';

const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const baseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingPatient = useSelector((state: RootState) => state.patients.list.find(p => p.id === id));

  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingPatient) {
      // console.log(existingPatient,'existingPatient....');

      setFormData(existingPatient);
    }
  }, [existingPatient]);

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

    try {
      if (formData?.id) {

        setLoading(true);

        const m = await apiPut(`${baseUrl}/patient/${formData?.id}`, formData);

        if (m) {
          dispatch(updatePatient(formData as Patient));
          showToast({
            text: "Updated successfully",
            type: "success",
          });
          setLoading(false);

          return;
        }

        // navigate('/patients');
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error.message);
      showToast({
        text: "Not Updated , try again",
        type: "error",
      });
    }
  };


  if (!existingPatient) return <div className="p-10 text-center">Patient not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Patient</h2>
          <p className="text-slate-500">Update record for {existingPatient.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData?.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input
                required
                type="email"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData?.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
              <input
                required
                type="tel"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Age</label>
              <input
                required
                type="number"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData.age || ''}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>

            {/* ///// */}


            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                value={formData?.gender}
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
                value={formData?.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']?.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* //// */}

          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Address</label>
            <textarea
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium resize-none"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            {/* <Save size={18} /> Update Patient */}

            {
              loading ?
                <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                  <Loader2 color={'#0ea5e9'} size={25} />
                </div>
                :
                <>
                  <Save size={18} /> Update Patient
                </>
            }

          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEdit;
