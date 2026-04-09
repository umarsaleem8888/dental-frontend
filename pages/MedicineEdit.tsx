
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { updateMedicine } from '../slices/medicinesSlice';
import { Medicine } from '../types';
import { ArrowLeft, Save, Pill, Loader2 } from 'lucide-react';
import { apiPost, apiPut } from '@/utilz/endpoints';
import Loading from '@/components/loading';
import { showToast } from '@/components/Toast';

const MedicineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingMed = useSelector((state: any) => state.medicines.list.find(m => m.id === id || m._id == id));
  const m = useSelector((state: RootState) => state.medicines);


  const baseUrl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState<Partial<Medicine>>({});



  useEffect(() => {
    if (existingMed) {
      setFormData(existingMed);
      console.log(existingMed,'formf');
      
    }
  }, [existingMed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

       if (!formData?.name || !formData?.category || !formData?.type) {

        console.log(formData,'fromDATa');
        
    
          showToast({
            text: "Please fill all fields",
            type: "info",
          })
          setLoading(false);
          return;
        }

    if (Number.isNaN(Number(formData?.price)) || formData?.price <= 0) {
      showToast({
        text: "Price should be a number and greater than 0",
        type: "info",
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      if (formData?.id) {
        const m = await apiPut(`${baseUrl}/medicines/${formData?.id}`, formData);

        console.log(formData,'ffff');
        

        if (m) {

          dispatch(updateMedicine(m as Medicine));
          setLoading(false);
  
          showToast({
            text: "Medicine Updated successfully",
            type: "success",
          });
        }

        // navigate('/medicines');
      }
    } catch (error: any) {
      setLoading(false);
      showToast({
        text: "Not Updated , try again",
        type: "error",
      });
      console.error(error.message);
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
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {['Antibiotic', 'Painkiller', 'Antiseptic', 'Analgesic', 'Anesthetic', 'Oral Rinse'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unit Type</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                {['Tablet', 'Bottle', 'Strip', 'Injection', 'Cream'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unit Price ($)</label>
              <input required type="number" step="0.01" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            {loading ? <div className="flex justify-center item-center w-full" > <Loader2 style={{ color: 'black', height: '16px', width: '16px' }} /> </div> : <div className="flex justify-center item-center w-full" > <Save size={18} /> Update Medicine </div>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicineEdit;
