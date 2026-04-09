
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addMedicine } from '../slices/medicinesSlice';
import { Medicine } from '../types';
import { ArrowLeft, Pill, Save, Plus, Layers, Info, Loader2 } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '@/utilz/endpoints';
import { showToast } from '@/components/Toast';

const MedicineForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [loading, setLoading] = useState(false);

  // Single Entry State
  const [singleData, setSingleData] = useState<Partial<Medicine>>({
    name: '',
    category: 'Antibiotic',
    price: 0,
    type: 'Tablet',
  });

  // Bulk Entry State
  const [bulkText, setBulkText] = useState('');

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!singleData?.name || !singleData?.category || !singleData?.type) {

      showToast({
        text: "Please fill all fields",
        type: "info",
      })

      setLoading(false);

      return;
    }

    if (singleData?.price <= 0) {

      showToast({
        text: "Please set valid the price",
        type: "info",
      })
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      const newMed: Medicine = {
        ...(singleData as Medicine),
        // id: `M${Math.floor(Math.random() * 900) + 100}`,
      };


      const m = await apiPost('medicines/', newMed);
      if (m) {

        const data = {
          id: m?._id,
          name: m?.name,
          category: m?.category,
          type: m?.type,
          price: m?.price
        }


        dispatch(addMedicine(data));
        showToast({
          text: "Created successfully",
          type: "success",
        })
        setLoading(false);
        // navigate('/medicines');
      }
    } catch (error: any) {
      console.error(error.message);
      showToast({
        text: "Not Created , try again",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const lines = bulkText.split('\n').filter(l => l.trim() !== '');
      const payload = [];

      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());

        if (parts.length >= 4) {
          var newMed: any = {
            name: parts[0],
            category: parts[1],
            type: parts[2],
            price: parseFloat(parts[3]) || 0,
          };


          if (Number.isNaN(Number(newMed?.price)) || newMed?.price <= 0) {
            showToast({
              text: "Price should be a number and greater than 0",
              type: "info",
            });
            setLoading(false);
            return;
          }
          const isDuplicate = payload.some((med: any) =>
            med.name === newMed.name &&
            med.category === newMed.category &&
            med.type === newMed.type
          );
          if (isDuplicate) {
            showToast({
              text: `Duplicate medicine found: ${newMed.name}`,
              type: "error",
            });
            setLoading(false);
            return;
          }
          payload.push(newMed);
        }
      }

      if (!payload || !payload?.length) {
        showToast({
          text: "empty formate not allowed",
          type: "info",
        })
        setLoading(false);
        return;
      }

      const m = await apiPost('medicines/bulk', payload);

      if (m) {
        showToast({
          text: "Created Successfully",
          type: "success",
        });
        dispatch(addMedicine(newMed));
        setLoading(false);
      }

      // navigate('/medicines');
    } catch (error: any) {
      setLoading(false);
      showToast({
        text: "Not Created , try again",
        type: "error",
      });
    }
  };


  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Medications</h2>
          <p className="text-slate-500">Update clinic inventory with new items.</p>
        </div>
      </div>

      <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => setMode('single')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'single' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400'}`}
        >
          Single Entry
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'bulk' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400'}`}
        >
          Bulk Import
        </button>
      </div>

      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Medicine Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Amoxicillin"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  value={singleData?.name}
                  onChange={e => setSingleData({ ...singleData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  value={singleData?.category}
                  onChange={e => setSingleData({ ...singleData, category: e.target.value })}
                >
                  {['Antibiotic', 'Painkiller', 'Antiseptic', 'Analgesic', 'Anesthetic', 'Oral Rinse'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unit Type</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  value={singleData?.type}
                  onChange={e => setSingleData({ ...singleData, type: e.target.value })}
                >
                  {['Tablet', 'Bottle', 'Strip', 'Injection', 'Cream'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Unit Price ($)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  value={singleData?.price}
                  onChange={e => setSingleData({ ...singleData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              {
                loading ?
                  <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                    <Loader2 color={'#0ea5e9'} size={25} />
                  </div>
                  :
                  <>
                    <Save size={18} /> Save Medicine
                  </>
              }
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleBulkSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex items-start gap-3">
              <Info className="text-amber-500 shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">CSV Format Required</p>
                <p className="text-xs text-amber-700 dark:text-amber-500/80">Enter one medicine per line: <strong>Name, Category, Unit, Price</strong></p>
              </div>
            </div>

            <textarea
              rows={10}
              placeholder="Amoxicillin, Antibiotic, Tablet, 12.50&#10;Ibuprofen, Painkiller, Tablet, 8.00"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 outline-none focus:border-primary-500/50 font-mono text-sm leading-relaxed"
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
            />
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              {
                loading ?
                  <div className=" w-full items-center justify-center animate-in fade-in duration-500">
                    <Loader2 color={'#0ea5e9'} size={25} />
                  </div>
                  :
                  <>
                    <Layers size={18} /> Import Bulk Medicines
                  </>

              }
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MedicineForm;
