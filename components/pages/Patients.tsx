
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  ExternalLink,
  Trash2,
  Users,
  Edit2
} from 'lucide-react';
import { deletePatient } from '../slices/patientsSlice';
import ConfirmDialog from '../components/ConfirmDialog';

const Patients: React.FC = () => {
  const dispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients.list);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteModal.id) {
      dispatch(deletePatient(deleteModal.id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients Repository</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your patient base and their records.</p>
        </div>
        <Link to="/patients/new" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
          <UserPlus size={20} /> New Patient
        </Link>
      </div>

      <div className="card-surface-transition rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wallet Balance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-primary-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">{patient.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold">{patient.name}</p>
                        <p className="text-xs text-slate-500 font-medium">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2 font-medium"><Phone size={14} className="text-slate-400" /> {patient.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${patient.walletBalance >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'}`}>
                      {patient.walletBalance > 0 ? '+' : patient.walletBalance < 0 ? '-' : ''}${Math.abs(patient.walletBalance).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link title="Edit Record" to={`/patients/edit/${patient.id}`} className="p-2 text-slate-400 hover:text-amber-500 transition-all"><Edit2 size={18} /></Link>
                      <Link title="View Profile" to={`/patients/${patient.id}`} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"><ExternalLink size={18} /></Link>
                      <button 
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: true, id: patient.id })}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="py-20 text-center">
               <Users className="mx-auto mb-4 text-slate-300" size={48} />
               <p className="text-slate-500 font-medium">No patients found.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Patient Record?"
        subtitle="This will permanently remove the patient profile and all linked history. This action cannot be undone."
      />
    </div>
  );
};

export default Patients;
