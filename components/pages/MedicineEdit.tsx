
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { updateMedicine } from '../slices/medicinesSlice';
import { Medicine } from '../types';
import { ArrowLeft, Save, Pill } from 'lucide-react';

const MedicineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingMed = useSelector((state: RootState) => state.medicines.list.find(m => m.id === id));

  const [formData, setFormData] = useState<Partial<Medicine>>({});

  useEffect(() => {
    if (existingMed) {
      setFormData(existingMed);
    }
  }, [existingMed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      dispatch(updateMedicine(formData as Medicine));
      navigate('/medicines');
    }
  };

  if (!existingMed) return <div className="p-10 text-center">Medicine not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Medicine</h2>
          <p className="text-slate-500">Update pricing or classification for {existingMed.name}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Name</label>
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {['Antibiotic', 'Painkiller', 'Antiseptic', 'Analgesic', 'Anesthetic', 'Oral Rinse'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unit Type</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                {['Tablet', 'Bottle', 'Strip', 'Injection', 'Cream'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unit Price ($)</label>
              <input required type="number" step="0.01" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.price || 0} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <Save size={18} /> Update Medicine
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicineEdit;
