
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addMedicine } from '../slices/medicinesSlice';
import { Medicine } from '../types';
import { ArrowLeft, Pill, Save, Plus, Layers, Info } from 'lucide-react';

const MedicineForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  // Single Entry State
  const [singleData, setSingleData] = useState<Partial<Medicine>>({
    name: '',
    category: 'Antibiotic',
    price: 0,
    unit: 'Tablet',
  });

  // Bulk Entry State
  const [bulkText, setBulkText] = useState('');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: Medicine = {
      ...singleData as Medicine,
      id: `M${Math.floor(Math.random() * 900) + 100}`,
    };
    dispatch(addMedicine(newMed));
    navigate('/medicines');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format: Name, Category, Unit, Price
    const lines = bulkText.split('\n').filter(l => l.trim() !== '');
    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 4) {
        const newMed: Medicine = {
          id: `M${Math.floor(Math.random() * 900) + 100}`,
          name: parts[0],
          category: parts[1],
          unit: parts[2],
          price: parseFloat(parts[3]) || 0,
        };
        dispatch(addMedicine(newMed));
      }
    });
    navigate('/medicines');
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
                  value={singleData.name}
                  onChange={e => setSingleData({...singleData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
                  value={singleData.category}
                  onChange={e => setSingleData({...singleData, category: e.target.value})}
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
                  value={singleData.unit}
                  onChange={e => setSingleData({...singleData, unit: e.target.value})}
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
                  value={singleData.price}
                  onChange={e => setSingleData({...singleData, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
            <button 
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Save size={18} /> Save Medicine
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
              <Layers size={18} /> Import Bulk Medicines
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MedicineForm;
