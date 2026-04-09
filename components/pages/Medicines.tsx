
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Trash2, 
  Pill,
  Edit2
} from 'lucide-react';
import { deleteMedicine } from '../slices/medicinesSlice';

const Medicines: React.FC = () => {
  const dispatch = useDispatch();
  const medicines = useSelector((state: RootState) => state.medicines.list);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this medicine from the catalog?')) {
      dispatch(deleteMedicine(id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Medicine Inventory</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage prescription drugs and pricing.</p>
        </div>
        <Link to="/medicines/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
          <Plus size={20} /> New Medicine
        </Link>
      </div>

      <div className="card-surface-transition rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMedicines.map(med => (
                <tr key={med.id} className="hover:bg-primary-500/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                          <Pill size={18} />
                       </div>
                       <div>
                          <p className="font-bold">{med.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{med.unit}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-black uppercase text-slate-500 tracking-wider">
                       {med.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">${med.price.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link to={`/medicines/edit/${med.id}`} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Edit2 size={16} /></Link>
                       <button onClick={() => handleDelete(med.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
